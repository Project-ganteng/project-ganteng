import Card from 'react-bootstrap/Card';

function ProjectContact(properties) {
    const {username,status,recentMessage} = properties
    return (
        <Card className="project-bg-light2 project-gy10">
            <Card.Body>
                <Card.Title>{username}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{status}</Card.Subtitle>
                <Card.Text>
                    {recentMessage}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default ProjectContact;