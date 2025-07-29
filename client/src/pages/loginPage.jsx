import ProjectNavbar from "../components/navbar.jsx"
import LoginForm from "../components/loginForm.jsx"
import {useState} from "react"

export default function LoginPage(){
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    
    return(
        <div>
            <LoginForm/>
        </div>
    )
}