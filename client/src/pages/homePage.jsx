import ProjectNavbar from "../components/navbar.jsx"
import ProjectContact from "../components/contact.jsx"
import ProjectTextEntry from "../components/textEntryForm.jsx"

export default function HomePage(){
    return(
        <div>
            <ProjectNavbar/>
            <div className="project-split project-tall">
                <div className="project-descending project-bg-light">
                    <ProjectTextEntry usage="search" actionText="Search"/>
                    <ProjectContact username="Ilham" status="Kelompok 1" recentMessage="hello world"/>
                    <ProjectContact username="Malik" status="Kelompok 1" recentMessage="hello world"/>
                    <ProjectContact username="Kamil" status="Kelompok 1" recentMessage="hello world"/>
                    <ProjectContact username="Raihan" status="Kelompok 1" recentMessage="hello world"/>
                </div>
                <div className="project-bg-dark project-tx-lime project-center">
                    <h1>Project Ganteng</h1>
                </div>
            </div>
        </div>
    )
}