from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import math, time, threading, json

app = FastAPI(title="Tow Dispatch POC")

# In-memory demo state
CALLS: Dict[str, dict] = {}
UNITS: Dict[str, dict] = {}
ROTATION: Dict[str, List[str]] = {}  # zone -> list of unit_ids cycling
ASSIGNMENTS: Dict[str, dict] = {}  # call_id -> assignment details
LOCK = threading.Lock()

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0  # km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat/2)**2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c  # km

class CadEvent(BaseModel):
    call_id: str = Field(...)
    lat: float
    lon: float
    reason: str
    priority: int = 3
    zone: Optional[str] = None
    timestamp: float = Field(default_factory=lambda: time.time())

class GpsUpdate(BaseModel):
    unit_id: str
    lat: float
    lon: float
    speed: float = 0.0
    zone: Optional[str] = None
    timestamp: float = Field(default_factory=lambda: time.time())

class AssignRequest(BaseModel):
    call_id: str
    unit_id: str

class LiveTrackingRequest(BaseModel):
    call_id: str
    unit_id: str
    status: str = "enroute"
    progress: Optional[int] = None

@app.post("/cad/event")
def cad_event(ev: CadEvent):
    with LOCK:
        CALLS[ev.call_id] = ev.model_dump()
    return {"ok": True, "call": CALLS[ev.call_id]}

@app.post("/gps")
def gps_update(upd: GpsUpdate):
    with LOCK:
        UNITS[upd.unit_id] = upd.model_dump()
        if upd.zone:
            z = ROTATION.setdefault(upd.zone, [])
            if upd.unit_id not in z:
                z.append(upd.unit_id)
    return {"ok": True, "unit": UNITS[upd.unit_id]}

@app.get("/dispatch/recommendation")
def recommendation(call_id: str, mode: str = "closest"):
    if call_id not in CALLS:
        raise HTTPException(status_code=404, detail="call_id not found")
    call = CALLS[call_id]
    if not UNITS:
        raise HTTPException(status_code=400, detail="no units available")
    if mode == "closest":
        # compute nearest by haversine
        best = None
        best_km = 1e9
        for uid, u in UNITS.items():
            km = haversine(call["lat"], call["lon"], u["lat"], u["lon"])
            if km < best_km:
                best_km = km
                best = uid
        return {"mode": "closest", "unit_id": best, "distance_km": round(best_km, 2)}
    elif mode == "rotation":
        zone = call.get("zone") or "default"
        z = ROTATION.setdefault(zone, list(UNITS.keys()))
        # rotate list
        if not z:
            return {"mode": "rotation", "unit_id": None}
        next_uid = z.pop(0)
        z.append(next_uid)
        ROTATION[zone] = z
        return {"mode": "rotation", "unit_id": next_uid}
    else:
        raise HTTPException(status_code=400, detail="unknown mode")

@app.post("/dispatch/assign")
def assign(req: AssignRequest):
    if req.call_id not in CALLS:
        raise HTTPException(status_code=404, detail="call_id not found")
    if req.unit_id not in UNITS:
        raise HTTPException(status_code=404, detail="unit_id not found")
    with LOCK:
        CALLS[req.call_id]["assigned_unit"] = req.unit_id
        CALLS[req.call_id]["status"] = "assigned"
        CALLS[req.call_id]["assigned_ts"] = time.time()
        
        # Create assignment tracking record
        ASSIGNMENTS[req.call_id] = {
            "call_id": req.call_id,
            "unit_id": req.unit_id,
            "status": "assigned",
            "progress": 0,
            "start_location": UNITS[req.unit_id],
            "destination": {"lat": CALLS[req.call_id]["lat"], "lon": CALLS[req.call_id]["lon"]},
            "assigned_at": time.time(),
            "estimated_arrival": None
        }
    return {"ok": True, "call": CALLS[req.call_id]}

@app.post("/live-tracking/update")
def update_live_tracking(req: LiveTrackingRequest):
    if req.call_id not in ASSIGNMENTS:
        raise HTTPException(status_code=404, detail="assignment not found")
    
    with LOCK:
        assignment = ASSIGNMENTS[req.call_id]
        assignment["status"] = req.status
        assignment["last_updated"] = time.time()
        
        if req.progress is not None:
            assignment["progress"] = req.progress
        
        # Calculate ETA based on current progress
        if req.status == "enroute" and req.unit_id in UNITS:
            unit = UNITS[req.unit_id]
            call = CALLS[req.call_id]
            distance_km = haversine(unit["lat"], unit["lon"], call["lat"], call["lon"])
            
            # Estimate time based on distance and speed
            speed_kmh = unit.get("speed", 30)  # default 30 km/h
            eta_minutes = max(1, int((distance_km / speed_kmh) * 60))
            assignment["estimated_arrival"] = f"{eta_minutes} min"
            assignment["distance_remaining"] = f"{distance_km:.1f} km"
    
    return {"ok": True, "assignment": assignment}

@app.get("/live-tracking/{call_id}")
def get_live_tracking(call_id: str):
    if call_id not in ASSIGNMENTS:
        raise HTTPException(status_code=404, detail="assignment not found")
    
    assignment = ASSIGNMENTS[call_id]
    unit_id = assignment["unit_id"]
    
    # Get current unit location
    current_location = UNITS.get(unit_id, {})
    
    # Calculate progress based on distance
    if current_location and assignment["destination"]:
        start = assignment["start_location"]
        current = current_location
        destination = assignment["destination"]
        
        total_distance = haversine(start["lat"], start["lon"], destination["lat"], destination["lon"])
        current_distance = haversine(current["lat"], current["lon"], destination["lat"], destination["lon"])
        
        if total_distance > 0:
            progress = max(0, min(100, int(((total_distance - current_distance) / total_distance) * 100)))
            assignment["progress"] = progress
    
    return {
        "call_id": call_id,
        "unit_id": unit_id,
        "status": assignment["status"],
        "progress": assignment["progress"],
        "current_location": current_location,
        "destination": assignment["destination"],
        "estimated_arrival": assignment.get("estimated_arrival", "Unknown"),
        "distance_remaining": assignment.get("distance_remaining", "Unknown"),
        "last_updated": assignment.get("last_updated", time.time())
    }

@app.get("/live-tracking")
def get_all_live_tracking():
    """Get all active live tracking assignments"""
    active_assignments = []
    
    for call_id, assignment in ASSIGNMENTS.items():
        if assignment["status"] in ["assigned", "enroute", "on_scene"]:
            unit_id = assignment["unit_id"]
            current_location = UNITS.get(unit_id, {})
            
            active_assignments.append({
                "call_id": call_id,
                "unit_id": unit_id,
                "status": assignment["status"],
                "progress": assignment["progress"],
                "current_location": current_location,
                "destination": assignment["destination"],
                "estimated_arrival": assignment.get("estimated_arrival", "Unknown"),
                "distance_remaining": assignment.get("distance_remaining", "Unknown"),
                "last_updated": assignment.get("last_updated", time.time())
            })
    
    return {"active_assignments": active_assignments, "count": len(active_assignments)}

@app.get("/debug/state")
def debug_state():
    return {"calls": list(CALLS.values()), "units": list(UNITS.values())}

@app.get("/reports/daily")
def reports_daily():
    # naive roll-up by reason
    roll = {}
    for c in CALLS.values():
        r = c.get("reason", "Unknown")
        roll[r] = roll.get(r, 0) + 1
    return {"counts_by_reason": roll, "total_calls": len(CALLS)}

@app.get("/healthz")
def healthz():
    return {"ok": True}
