import Widget from './Widget'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Module Template (Standalone Mode)</h1>
      <hr />
      <div style={{ maxWidth: '400px' }}>
        <Widget />
      </div>
    </div>
  )
}

export default App