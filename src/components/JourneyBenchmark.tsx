import { useState } from 'react';

interface Props {
  wasm: any;
  limit: number;
}

const JourneyBenchmark = ({ wasm, limit }: Props) => {
  const [stats, setStats] = useState<{wasmTime: number, jsTime: number} | null>(null);

  const runBenchmark = () => {
    // WASM
    const t0 = performance.now();
    wasm.calculateJourney(limit);
    const t1 = performance.now();

    // JS Equivalent
    const t2 = performance.now();
    const p = 0.017453292519943295;
    let dist = 0;
    for (let i = 0; i < limit; i++) {
      let lat1 = 51.5074 + (i * 0.00001), lat2 = 48.8566;
      let a = 0.5 - Math.cos((lat2 - lat1) * p) / 2 + Math.cos(lat1 * p) * Math.cos(48.8566 * p) * (1 - Math.cos((2.3522 - (-0.1278)) * p)) / 2;
      dist += 12742 * Math.asin(Math.sqrt(a));
    }
    const t3 = performance.now();

    setStats({ wasmTime: t1 - t0, jsTime: t3 - t2 });
  };

  return (
    <div className="benchmark-card">
      <h5>GPS Journey (Float Math Stress)</h5>
      <button onClick={runBenchmark} className="btn-run">Run Journey</button>
      {stats && (
        <div className="results">
          <p>WASM: {stats.wasmTime.toFixed(3)}ms</p>
          <p>JS: {stats.jsTime.toFixed(3)}ms</p>
        </div>
      )}
    </div>
  );
};

export default JourneyBenchmark;

/* 

Result: 
WASM starts to pull ahead as N increases.

Insight: 
- JavaScript has to look up Math.sin and Math.cos on the global object. In WASM, these are hardware-level instructions. 
- This shows WASM’s advantage in consistent, complex mathematical modeling.

*/