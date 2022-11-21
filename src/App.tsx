import React from "react"
import "./App.css"
import EthProvider from "./Context/EthProvider"
import Connect from "./Component/Connect"

function App() {
   return (
      <div className="App">
         <h2>My Stacking Plateform</h2>
         <EthProvider>
            <Connect />
         </EthProvider>
      </div>
   )
}

export default App
