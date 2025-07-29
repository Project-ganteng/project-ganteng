import {useNavigate} from "react-router"
import {useEffect} from "react"

export default function IndexPage(){
    const navigate=useNavigate()
    function f(){
        navigate("/home")
    }
    useEffect(f(),[])
    return(
        <div onUseEffect={useEffect}>
        </div>
    )
}