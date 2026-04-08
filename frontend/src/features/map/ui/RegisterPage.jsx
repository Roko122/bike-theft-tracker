import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { registerUser } from '../../api/authApi.js';
import { passwordsMatch, validatePassword } from './passwordValidation.js';

export default function RegisterPage({ onRegistered }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const passwordValidation = validatePassword(password);
  const unmetPasswordRules = passwordValidation.rules.filter(
    (rule) => !rule.passed
  );
  const isPasswordValid = passwordValidation.isValid;
  const isPasswordMatch = passwordsMatch(password, confirmPassword);
  const showPasswordMismatch = confirmPassword.length > 0 && !isPasswordMatch;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Salasana ei täytä vaatimuksia');
      return;
    }

    if (!isPasswordMatch) {
      setError('Salasanat eivät täsmää');
      return;
    }

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
              type={showPasswords ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div style={{ marginTop: 6 }}>
              {unmetPasswordRules.map((rule) => (
                <Form.Text key={rule.key} className="text-danger d-block">
                  {rule.label}
                </Form.Text>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Salasana uudelleen</Form.Label>
            <Form.Control
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {showPasswordMismatch && (
              <Form.Text className="text-danger d-block">
                Salasanat eivät ole samat
              </Form.Text>
            )}
          </Form.Group>

          <Form.Check
            type="checkbox"
            id="show-passwords"
            label="Näytä salasanat"
            checked={showPasswords}
            onChange={(e) => setShowPasswords(e.target.checked)}
          />

          <Button
            type="submit"
            disabled={loading || !isPasswordValid || !isPasswordMatch}
          >
            {loading ? 'Luodaan tiliä...' : 'Luo tili'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
