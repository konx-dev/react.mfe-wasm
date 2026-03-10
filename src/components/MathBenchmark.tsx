import { useState } from 'react';

const MathBenchmark = ({ wasm, limit }: { wasm: any, limit: number }) => {
  const [stats, setStats] = useState<{wasmTime: number, jsTime: number} | null>(null);

  const runBenchmark = () => {
    // --- WASM ---
    const t0 = performance.now();
    wasm.computeSignal(limit);
    const t1 = performance.now();

    // --- JS ---
    const t2 = performance.now();
    let result = 0.5;
    for (let i = 0; i < limit; i++) {
      let x = i * 0.0001;
      result = Math.sin(x) * Math.cos(result) + Math.sqrt(x);
      
      // Simulating bitwise on floats in JS is clunky and slow
      let view = new DataView(new ArrayBuffer(4));
      view.setFloat32(0, result);
      let temp = (view.getUint32(0) << 1) ^ 0x5f3759df;
      view.setUint32(0, temp);
      result = view.getFloat32(0);
    }
    const t3 = performance.now();

    setStats({ wasmTime: t1 - t0, jsTime: t3 - t2 });
  };

  return (
    <div className="benchmark-card">
      <h5>Signal Processor (Complex Math)</h5>
      <p className="small italic text-muted">Uses 32-bit floats and bit-shifting.</p>
      <button onClick={runBenchmark} className="btn-run">Run Signal Test</button>
      {stats && (
        <div className="results">
          <p>WASM: <strong>{stats.wasmTime.toFixed(2)}ms</strong></p>
          <p>JS: <strong>{stats.jsTime.toFixed(2)}ms</strong></p>
          <p className="speed-factor">{(stats.jsTime / stats.wasmTime).toFixed(1)}x Faster</p>
        </div>
      )}
    </div>
  );
};

export default MathBenchmark;

/* 

Result: 
WASM wins massively.

Insight: 
- JS struggles with bitwise operations on floating-point numbers because it has to simulate them using 64-bit floats. 
- WASM uses 32-bit (f32) floats directly, which is exactly how CPU registers work.

*/