import { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

export default function LoginPage({ onLoginSuccess, onFirstTime }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onLoginSuccess?.({ email });
  }

  return (
    <Card className="border-0 shadow-none" style={{ maxWidth: 420 }}>
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

          <Button type="submit" className="w-100">
            Kirjaudu
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-100 mt-2"
            onClick={() => onFirstTime?.()}
          >
            Luo käyttäjä ensimmäistä kertaa
          </Button>
        </Form>

                <Button
                    type="button"
                    variant="outline-secondary"
                    className="mt-2"
                    onClick={() => onFirstTime?.()}
                >
                    Luo tunnus
                </Button>
      </Card.Body>
    </Card>
  );
}
