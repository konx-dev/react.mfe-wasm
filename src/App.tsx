import Widget from './Widget'

function App() {
  return (
    <div>
      <div className="bg-black text-white p-4 mb-14">
        <h1 className="container mx-auto"><strong>Standalone Mode:</strong> WebAssembly Benchmarks</h1>
      </div>
      
      <div className="container mx-auto border-2 border-red-500 relative">
        <div className="bg-red-500 border border-red-500 p-2 text-white text-xs font-bold absolute top-[-35px] right-[-2px]">Module Boundary</div>
        <Widget />
      </div>
    </div>
  )
}

export default App