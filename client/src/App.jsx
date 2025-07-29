import {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-bootstrap"
import {BrowserRouter,Routes,Route} from "react-router"
import './App.css'
import IndexPage from "./pages/indexPage.jsx"
import LoginPage from "./pages/loginPage.jsx"
import HomePage from "./pages/homePage.jsx"

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/home" element={<HomePage/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
