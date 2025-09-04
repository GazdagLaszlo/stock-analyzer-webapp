//import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom';
import Routing from "./router/Routing.tsx";

function App() {
  //const [count, setCount] = useState(0)

  return <>
      <BrowserRouter>
        <Routing/>
      </BrowserRouter>
    </>
}

export default App;