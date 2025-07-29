import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function ProjectNavbar() {
    return (
        <Navbar expand="lg" className="project-bg-green">
            <Container>
                <Navbar.Brand>Project Ganteng</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="./home">Chat</Nav.Link>
                        <Nav.Link href="./myProfile">My Profile</Nav.Link>
                        <Nav.Link href="./logout">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default ProjectNavbar;