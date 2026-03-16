import { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

export default function RegisterPage({ onRegistered }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onRegistered?.({ username, email });
  }

  return (
    <Card className="border-0 shadow-none" style={{ maxWidth: 420 }}>
      <Card.Body>
        <Card.Title>Luo tunnus</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Käyttäjätunnus</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
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
          <Button type="submit">Luo tili</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
