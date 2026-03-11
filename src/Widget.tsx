import { useState } from 'react';
// @ts-ignore
import * as wasm from '../build/benchmark.js';
import PrimeBenchmark from './components/PrimeBenchmark';
import JourneyBenchmark from './components/JourneyBenchmark';
import MathBenchmark from './components/MathBenchmark';

if (import.meta.env.PROD) {
  import('./styles/remote.css');
} else {
  import('./styles/local.css');
}

type BenchmarkMode = 'primes' | 'journey' | 'math';

const Widget = () => {
  const [limit, setLimit] = useState(1000000);
  const [activeTab, setActiveTab] = useState<BenchmarkMode>('primes');

  return (
    <div className="wasm-widget-container p-3">
      <h4 className="bg-primary p-3 text-white rounded">WASM Performance Investigation</h4>
      
      <div className="controls my-4 p-4 bg-light border rounded">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="fw-bold text-dark">Intensity (N): {limit.toLocaleString()}</label>
        </div>
        <input 
          type="range"
          min="1000000"
          max="50000000"
          step="1000000"
          value={limit} 
          onChange={(e) => setLimit(Number(e.target.value))} 
          className="w-full"
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="tab-buttons d-flex gap-2 mb-4">
        <button 
          className={`btn flex-fill ${activeTab === 'primes' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveTab('primes')}
        >
          Primes
        </button>
        <button 
          className={`btn flex-fill ${activeTab === 'journey' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveTab('journey')}
        >
          Journey
        </button>
        <button 
          className={`btn flex-fill ${activeTab === 'math' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveTab('math')}
        >
          Signal
        </button>
      </div>

      {/* The 'key' ensures the sub-component resets when you switch tabs */}
      <div className="display-area p-3 border rounded bg-white shadow-sm" key={activeTab}>
        {activeTab === 'primes' && <PrimeBenchmark wasm={wasm} limit={limit} />}
        {activeTab === 'journey' && <JourneyBenchmark wasm={wasm} limit={limit} />}
        {activeTab === 'math' && <MathBenchmark wasm={wasm} limit={limit} />}
      </div>
    </div>
  );
};

export default Widget;