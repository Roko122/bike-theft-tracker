import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { registerUser } from './auth.Api';

export default function RegisterPage({ onRegistered }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const result = await registerUser({ username, email, password });
      onRegistered?.(result);
    } catch (err) {
      setError(err.message || 'Rekisteröinti epäonnistui');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-0 shadow-none" style={{ maxWidth: 420 }}>
      <Card.Body>
        <Card.Title>Luo tunnus</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

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

          <Button type="submit" disabled={loading}>
            {loading ? 'Luodaan tiliä...' : 'Luo tili'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
