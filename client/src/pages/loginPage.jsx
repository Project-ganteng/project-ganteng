import ProjectNavbar from "../components/navbar.jsx"
import LoginForm from "../components/loginForm.jsx"
import {useNavigate} from "react-router"
import {useState} from "react"

export default function LoginPage(){
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate()
    function login(event){
        event.PreventDefault()
        localStorage.setItem("username",username)
        useNavigate("/home")
    }
    return(
        <div className="project-split">
            <LoginForm/>
        </div>
    )
}