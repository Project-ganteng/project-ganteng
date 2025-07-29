import ProjectNavbar from "../components/navbar.jsx"
import ProjectLoginForm from "../components/loginForm.jsx"
import {useNavigate} from "react-router"
import {useState} from "react"

export default function LoginPage(){
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate()
    // function login(event){
    //     event.PreventDefault()
    //     localStorage.setItem("username",username)
    //     useNavigate("/home")
    // }
    return(
        <div className="project-split project-tall">
            <div className="project-center project-bg-light">
                <div className="project-bg-light2 project-r20 project-p20">
                    <h1>Login</h1>
                    <ProjectLoginForm/>
                </div>
            </div>
            
            <div className="project-bg-dark project-tx-lime project-center">
                <h1>Project Ganteng</h1>
            </div>
        </div>
    )
}