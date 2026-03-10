export function calculateJourney(points: i32): f64 {
  let totalDistance: f64 = 0;
  const p = 0.017453292519943295; // Math.PI / 180
  
  for (let i = 0; i < points; i++) {
    let lat1 = 51.5074 + (i * 0.00001);
    let lon1 = -0.1278;
    let lat2 = 48.8566;
    let lon2 = 2.3522;

    let a = 0.5 - Math.cos((lat2 - lat1) * p) / 2 + 
            Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p)) / 2;
    
    totalDistance += 12742 * Math.asin(Math.sqrt(a));
  }
  return totalDistance;
}