import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import environment from './config'
import ConfirmableButton from './components/ConfirmableAction'
import { Button } from '@mui/material'

function App() {
  const [count, setCount] = useState(0)

  const handleIncrement = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setCount((prev) => prev + 1)
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>AWS - CloudFront + Pipeline + {environment}</h1>
      <div className="card">
        {count}
        <br />
        <ConfirmableButton
          modalCancelText='Cancelar incremento'
          modalConfirmText='Confirmar incremento'
          modalContent='Desea incrementar o contador?'
          modalTitle='Incrementar contador'
          waitActionCompletion={true}
          onConfirm={handleIncrement}
          RenderChild={(props) => (
            <Button onClick={props.triggerModal}>hello custom button</Button>
          )}
        />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
