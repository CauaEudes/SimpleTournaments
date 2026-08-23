import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { fazerLogin } from '../services/api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const usuario = await fazerLogin(email, senha);
      onLogin(usuario);
      navigate('/home');
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="card-icon">🏆</div>
        <h2>Entrar</h2>
        <p className="card-subtitle">Acesse sua conta do SimpleTournaments</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-senha">Senha</label>
            <input
              id="login-senha"
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {erro && <p className="erro" role="alert">{erro}</p>}
          <button type="submit" disabled={carregando} className="btn-primary">
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-link">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
export default Login;
