import {useNavigate} from "react-router"
import {useEffect} from "react"

export default function LogoutPage(){
    const navigate=useNavigate()
    function f(){
        localStorage.removeItem("username")
        navigate("/login")
    }
    return(
        <div onSomething={f()}>
        </div>
    )
}