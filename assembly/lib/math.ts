export function computeSignal(iterations: i32): f32 {
  let result: f32 = 0.5;

  for (let i = 0; i < iterations; i++) {
    // f32 math is significantly faster in WASM than JS's default f64
    let x: f32 = <f32>i * 0.0001;
    
    // Complex math chain
    result = (Math.sin(x) as f32) * (Math.cos(result) as f32) + (Math.sqrt(x) as f32);
    
    // Bitwise manipulation on a float (very "expensive" for JS to simulate)
    let temp = reinterpret<u32>(result);
    temp = (temp << 1) ^ 0x5f3759df; 
    result = reinterpret<f32>(temp);
  }

  return result;
}