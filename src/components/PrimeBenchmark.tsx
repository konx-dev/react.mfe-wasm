import { useState } from 'react';

interface Props {
  wasm: any;
  limit: number;
}

// PERSISTENT BUFFER: Allocated once to avoid Garbage Collection (GC) pauses
let jsSieveBuffer = new Uint8Array(0);

const PrimeBenchmark = ({ wasm, limit }: Props) => {
  const [stats, setStats] = useState<{wasmTime: number, jsTime: number} | null>(null);

  const runBenchmark = () => {
    // --- WASM RUN ---
    // Best Practice: Calling into WASM only once to perform a massive workload
    const t0 = performance.now();
    wasm.findPrimes(limit);
    const t1 = performance.now();

    // --- JS RUN ---
    const t2 = performance.now();
    
    // Memory Management: Re-use existing buffer or grow if necessary
    if (jsSieveBuffer.length <= limit) {
      jsSieveBuffer = new Uint8Array(limit + 1);
    } else {
      // JS Best Practice: .fill(0) is optimized at the engine level (memset)
      jsSieveBuffer.fill(0);
    }

    // Optimization: Cache reference and length to prevent property lookups in loops
    const buffer = jsSieveBuffer;
    
    for (let candidate = 2; candidate <= limit; candidate++) {
      // Check if the number is prime
      if (buffer[candidate] === 0) {
        // Optimization: Standardize the math to match WASM's square-start logic
        let multiple = candidate * candidate;
        
        // JS Best Practice: A 'while' loop is often easier for the JIT to 
        // optimize into a simple "add and compare" assembly instruction.
        while (multiple <= limit) {
          buffer[multiple] = 1;
          multiple += candidate;
        }
      }
    }
    const t3 = performance.now();

    setStats({ wasmTime: t1 - t0, jsTime: t3 - t2 });
  };

  return (
    <div className="p-3 border rounded bg-light text-dark shadow-sm">
      <h5 className="border-bottom pb-2 mb-3">Prime Sieve (Memory Performance)</h5>
      
      <div className="alert alert-info py-2 small">
        <strong>Optimization Audit:</strong> Both versions use persistent buffers. 
        WASM uses <code>unchecked()</code> bounds-check elimination, while JS uses V8 JIT loop-unrolling.
      </div>
      
      <button onClick={runBenchmark} className="btn btn-primary w-100 my-2 fw-bold">
        Run Comparison
      </button>

      {stats && (
        <div className="mt-3 p-3 bg-white border rounded shadow-inner">
          <div className="d-flex justify-content-between mb-1">
            <span className="text-secondary">WebAssembly:</span>
            <span className="font-monospace">{stats.wasmTime.toFixed(3)} ms</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-secondary">JavaScript:</span>
            <span className="font-monospace">{stats.jsTime.toFixed(3)} ms</span>
          </div>
          
          <div className="pt-2 border-top text-center">
            {stats.wasmTime < stats.jsTime ? (
              <span className="text-success small fw-bold">
                WASM is {(stats.jsTime / stats.wasmTime).toFixed(2)}x faster
              </span>
            ) : (
              <span className="text-warning small fw-bold">
                JS is {(stats.wasmTime / stats.jsTime).toFixed(2)}x faster
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrimeBenchmark;

/* 

Result: 
JS and WASM are likely very close (or JS might even win slightly at lower intensities).

Insight: 
- This demonstrates that for linear memory access and simple logic, the JavaScript V8 engine is incredibly well-optimized. 
- The overhead of moving data into WASM often outweighs the execution speed.

*/