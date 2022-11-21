import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import "./App.css"
import EthProvider from "./Context/EthProvider"
import Connect from "./Component/Connect"
import Erreur from "./Component/Erreur"
import AddPool from "./Pages/AddPool"
import Stacking from "./Pages/Stacking"
import Home from "./Pages/Home"
import Navbar from "./Component/Navbar"

function App() {
    return (
        <div className="App">
            <header>
                <Navbar />
            </header>
            <EthProvider>
                <Connect />
                <Router>
                    <Routes>
                        <Route path="" element={<Home />}></Route>
                        <Route path="/AddPool" element={<AddPool />}></Route>
                        <Route path="/Stacking" element={<Stacking />}></Route>
                        <Route path="*" element={<Erreur />}></Route>
                    </Routes>
                </Router>
            </EthProvider>
        </div>
    )
}

export default App
