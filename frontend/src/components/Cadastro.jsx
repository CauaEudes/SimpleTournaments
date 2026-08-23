import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { cadastrarUsuario } from '../services/api';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    if (!nome || !email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    setCarregando(true);
    try {
      await cadastrarUsuario({ nome, email, senha });
      navigate('/login');
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="card-icon">📝</div>
        <h2>Criar conta</h2>
        <p className="card-subtitle">Crie sua conta para gerenciar torneios</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cad-nome">Nome</label>
            <input
              id="cad-nome"
              type="text"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cad-email">E-mail</label>
            <input
              id="cad-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cad-senha">Senha</label>
            <input
              id="cad-senha"
              type="password"
              placeholder="Crie uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {erro && <p className="erro" role="alert">{erro}</p>}
          <button type="submit" disabled={carregando} className="btn-primary">
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="auth-link">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
export default Cadastro;
