import { NimiqDemo } from './components/NimiqDemo'

function App() {
  return (
    <div className="container-fluid" style={{ maxWidth: '500px', margin: '0 auto', padding: '1rem' }}>
      <hgroup style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h3>Nimiq React Starter</h3>
        <p><small>Nimiq web client integration demo</small></p>
      </hgroup>

      <NimiqDemo />
    </div>
  )
}

export default App
