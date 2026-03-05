import { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

export default function LoginPage({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        onLoginSuccess?.({ email });
    }

    return (
        <Card className="shadow-sm" style={{ maxWidth: 420 }}>
            <Card.Body>
                <Card.Title>Kirjaudu sisään</Card.Title>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Sähköposti</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Salasana</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button type="submit">Kirjaudu</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}