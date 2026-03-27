import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { loginUser } from '../../api/authApi.js';

export default function LoginPage({ onLoginSuccess, onFirstTime }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const user = await loginUser({ username, password });
      onLoginSuccess?.(user);
    } catch (err) {
      setError(err.message || 'Kirjautuminen epäonnistui');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-0 shadow-none" style={{ maxWidth: 420 }}>
      <Card.Body>
        <Card.Title>Kirjaudu sisään</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Käyttäjänimi</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? 'Kirjaudutaan...' : 'Kirjaudu'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-100 mt-2"
            onClick={() => onFirstTime?.()}
          >
            Luo tunnus
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
