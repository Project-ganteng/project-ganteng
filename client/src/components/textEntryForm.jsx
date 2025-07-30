import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function ProjectTextEntry(properties) {
    const {usage,actionText}=properties
    return (
        <Form>
            <div className="project-sideways-right">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>{actionText}</Form.Label>
                    <div>
                        <Form.Control type="text" name={usage} placeholder={actionText+`...`} />
                        <Button variant="primary" type="submit" value="">
                            {actionText}
                        </Button>
                    </div>
                </Form.Group>
            </div>
        </Form>
    );
}

export default ProjectTextEntry;