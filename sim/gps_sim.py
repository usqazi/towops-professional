import time, random, argparse, requests

def jitter(val, scale=0.001):
    return val + (random.random() - 0.5) * scale

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--api", default="http://localhost:8000")
    ap.add_argument("--units", type=int, default=5)
    ap.add_argument("--seconds", type=int, default=2)
    ap.add_argument("--lat", type=float, default=32.7157)  # San Diego
    ap.add_argument("--lon", type=float, default=-117.1611)
    ap.add_argument("--zone", type=str, default="Z-1")
    args = ap.parse_args()

    # Seed units
    for i in range(args.units):
        uid = f"TRUCK-{i+1:02d}"
        lat = jitter(args.lat, 0.02)
        lon = jitter(args.lon, 0.02)
        requests.post(f"{args.api}/gps", json={"unit_id": uid, "lat": lat, "lon": lon, "speed": 0, "zone": args.zone})

    # Loop updates
    while True:
        for i in range(args.units):
            uid = f"TRUCK-{i+1:02d}"
            lat = jitter(args.lat, 0.03)
            lon = jitter(args.lon, 0.03)
            requests.post(f"{args.api}/gps", json={"unit_id": uid, "lat": lat, "lon": lon, "speed": 25, "zone": args.zone})
        time.sleep(args.seconds)

if __name__ == "__main__":
    main()
