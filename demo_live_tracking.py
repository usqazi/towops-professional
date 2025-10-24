#!/usr/bin/env python3
"""
Live Tow Tracking Demo Script
Simulates real-time tow truck tracking like Uber
"""

import requests
import time
import json
import random

API_BASE = "http://localhost:8000"

def create_test_incident():
    """Create a test incident"""
    incident_data = {
        "call_id": f"DEMO-{int(time.time())}",
        "lat": 32.7157 + random.uniform(-0.01, 0.01),
        "lon": -117.1611 + random.uniform(-0.01, 0.01),
        "reason": "Accident",
        "priority": random.randint(1, 3)
    }
    
    response = requests.post(f"{API_BASE}/cad/event", json=incident_data)
    if response.status_code == 200:
        print(f"✅ Created incident: {incident_data['call_id']}")
        return incident_data['call_id']
    else:
        print(f"❌ Failed to create incident: {response.text}")
        return None

def assign_truck(call_id, unit_id="TRUCK-001"):
    """Assign a truck to the incident"""
    assign_data = {
        "call_id": call_id,
        "unit_id": unit_id
    }
    
    response = requests.post(f"{API_BASE}/dispatch/assign", json=assign_data)
    if response.status_code == 200:
        print(f"✅ Assigned {unit_id} to {call_id}")
        return True
    else:
        print(f"❌ Failed to assign truck: {response.text}")
        return False

def update_truck_location(unit_id, lat, lon, speed=30):
    """Update truck GPS location"""
    gps_data = {
        "unit_id": unit_id,
        "lat": lat,
        "lon": lon,
        "speed": speed,
        "zone": "Z-1"
    }
    
    response = requests.post(f"{API_BASE}/gps", json=gps_data)
    if response.status_code == 200:
        print(f"📍 Updated {unit_id} location: {lat:.4f}, {lon:.4f}")
        return True
    else:
        print(f"❌ Failed to update GPS: {response.text}")
        return False

def update_tracking_status(call_id, unit_id, status, progress=None):
    """Update live tracking status"""
    tracking_data = {
        "call_id": call_id,
        "unit_id": unit_id,
        "status": status
    }
    
    if progress is not None:
        tracking_data["progress"] = progress
    
    response = requests.post(f"{API_BASE}/live-tracking/update", json=tracking_data)
    if response.status_code == 200:
        print(f"🔄 Updated {call_id} status: {status} ({progress}%)")
        return True
    else:
        print(f"❌ Failed to update tracking: {response.text}")
        return False

def simulate_tow_journey(call_id, unit_id, destination_lat, destination_lon):
    """Simulate a complete tow truck journey"""
    print(f"\n🚛 Starting tow journey for {call_id}")
    
    # Start location (random nearby location)
    start_lat = destination_lat + random.uniform(-0.02, 0.02)
    start_lon = destination_lon + random.uniform(-0.02, 0.02)
    
    # Update initial truck location
    update_truck_location(unit_id, start_lat, start_lon, 0)
    
    # Mark as enroute
    update_tracking_status(call_id, unit_id, "enroute", 0)
    
    # Simulate journey with multiple GPS updates
    steps = 10
    for i in range(steps):
        # Calculate intermediate position
        progress = (i + 1) / steps
        current_lat = start_lat + (destination_lat - start_lat) * progress
        current_lon = start_lon + (destination_lon - start_lon) * progress
        
        # Add some randomness to make it more realistic
        current_lat += random.uniform(-0.001, 0.001)
        current_lon += random.uniform(-0.001, 0.001)
        
        # Update GPS location
        speed = random.randint(25, 45)  # mph
        update_truck_location(unit_id, current_lat, current_lon, speed)
        
        # Update tracking progress
        progress_percent = int(progress * 100)
        update_tracking_status(call_id, unit_id, "enroute", progress_percent)
        
        # Wait between updates
        time.sleep(2)
    
    # Mark as on scene
    update_tracking_status(call_id, unit_id, "on_scene", 100)
    print(f"🎯 {unit_id} arrived at scene for {call_id}")
    
    # Wait a bit, then mark as complete
    time.sleep(3)
    update_tracking_status(call_id, unit_id, "complete", 100)
    print(f"✅ {call_id} completed")

def get_live_tracking():
    """Get current live tracking data"""
    response = requests.get(f"{API_BASE}/live-tracking")
    if response.status_code == 200:
        data = response.json()
        print(f"\n📊 Live Tracking Status:")
        print(f"   Active assignments: {data.get('count', 0)}")
        
        for assignment in data.get('active_assignments', []):
            print(f"   📍 {assignment['call_id']}: {assignment['status']} ({assignment['progress']}%)")
            print(f"      Truck: {assignment['unit_id']}, ETA: {assignment['estimated_arrival']}")
        
        return data
    else:
        print(f"❌ Failed to get live tracking: {response.text}")
        return None

def main():
    """Main demo function"""
    print("🚛 TowOps Live Tracking Demo")
    print("=" * 40)
    
    # Create multiple test incidents
    incidents = []
    for i in range(3):
        call_id = create_test_incident()
        if call_id:
            incidents.append(call_id)
        time.sleep(1)
    
    if not incidents:
        print("❌ No incidents created. Exiting.")
        return
    
    # Assign trucks and start journeys
    for i, call_id in enumerate(incidents):
        unit_id = f"TRUCK-{i+1:03d}"
        
        # Assign truck
        if assign_truck(call_id, unit_id):
            # Get incident location from debug state
            debug_response = requests.get(f"{API_BASE}/debug/state")
            if debug_response.status_code == 200:
                debug_data = debug_response.json()
                for call in debug_data.get('calls', []):
                    if call['call_id'] == call_id:
                        destination_lat = call['lat']
                        destination_lon = call['lon']
                        
                        # Start journey simulation in background
                        simulate_tow_journey(call_id, unit_id, destination_lat, destination_lon)
                        break
        
        time.sleep(5)  # Stagger the starts
    
    # Monitor live tracking
    print("\n🔍 Monitoring live tracking...")
    for _ in range(10):
        get_live_tracking()
        time.sleep(5)
    
    print("\n✅ Demo completed!")

if __name__ == "__main__":
    main()
