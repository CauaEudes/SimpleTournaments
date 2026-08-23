import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router';
import { listarTorneios, criarTorneio, removerTorneio, listarParticipantes } from '../services/api';
import TorneioCard from './TorneioCard';
import TorneioForm from './TorneioForm';
import TorneioDetalhe from './TorneioDetalhe';
import ConfirmDialog from './ConfirmDialog';

function Home({ usuarioLogado, onSair }) {
  const [torneios, setTorneios] = useState([]);
  const [contagem, setContagem] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [confirmando, setConfirmando] = useState(null);
  const [torneioSelecionado, setTorneioSelecionado] = useState(null);
  const [sucesso, setSucesso] = useState('');

  const gridRef = useRef(null);
  const erroTimeout = useRef(null);
  const sucessoTimeout = useRef(null);

  function mostrarErroTemporario(msg) {
    setErro(msg);
    clearTimeout(erroTimeout.current);
    erroTimeout.current = setTimeout(() => setErro(''), 5000);
  }

  function mostrarSucessoTemporario(msg) {
    setSucesso(msg);
    clearTimeout(sucessoTimeout.current);
    sucessoTimeout.current = setTimeout(() => setSucesso(''), 3000);
  }

  async function carregarTorneios() {
    if (!usuarioLogado) return;
    setCarregando(true);
    setErro('');
    try {
      const lista = await listarTorneios(usuarioLogado.id);
      setTorneios(lista);

      const contagemMap = {};
      await Promise.all(
        lista.map(async (t) => {
          try {
            const parts = await listarParticipantes(t.id);
            contagemMap[t.id] = parts.length;
          } catch {
            contagemMap[t.id] = 0;
          }
        })
      );
      setContagem(contagemMap);
    } catch (err) {
      mostrarErroTemporario(err.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (usuarioLogado) {
      carregarTorneios();
    }
  }, [usuarioLogado]);

  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }

  async function handleCriarTorneio(dados) {
    await criarTorneio(dados);
    mostrarSucessoTemporario('Torneio criado com sucesso!');
    await carregarTorneios();
  }

  async function confirmarRemocao() {
    if (!confirmando) return;
    try {
      await removerTorneio(confirmando.id);
      setConfirmando(null);
      mostrarSucessoTemporario('Torneio removido com sucesso!');
      await carregarTorneios();
      if (gridRef.current) gridRef.current.focus();
    } catch (err) {
      mostrarErroTemporario(err.message);
      setConfirmando(null);
    }
  }

  if (torneioSelecionado) {
    return (
      <TorneioDetalhe
        torneioId={torneioSelecionado}
        onVoltar={() => {
          setTorneioSelecionado(null);
          carregarTorneios();
        }}
      />
    );
  }

  const filtrados = torneios.filter((t) =>
    t.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <div className="home-header">
        <div className="home-welcome">
          <h2>Olá, {usuarioLogado.nome}! 👋</h2>
          <p>Gerencie seus torneios</p>
        </div>
        <button className="btn-logout" onClick={onSair}>
          Sair
        </button>
      </div>

      {sucesso && <p className="sucesso" role="status">{sucesso}</p>}
      {erro && (
        <div className="erro toast-erro" role="alert">
          <span>{erro}</span>
          <button className="btn-close-toast" onClick={() => setErro('')} aria-label="Fechar">
            ×
          </button>
        </div>
      )}

      <div className="torneios-toolbar">
        <div className="form-group search-group">
          <label htmlFor="busca-torneio">Buscar torneio</label>
          <input
            id="busca-torneio"
            type="text"
            placeholder="Filtrar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={() => setMostrarForm(true)}>
          + Novo Torneio
        </button>
      </div>

      {carregando ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Carregando torneios...</p>
        </div>
      ) : (
        <div className="torneios-grid" ref={gridRef} aria-live="polite" tabIndex={-1}>
          {filtrados.length === 0 && (
            <div className="lista-vazia card">
              {torneios.length === 0 ? (
                <p>Você ainda não criou nenhum torneio. Clique em "+ Novo Torneio" para começar!</p>
              ) : (
                <p>Nenhum torneio encontrado para "{busca}".</p>
              )}
            </div>
          )}
          {filtrados.map((t) => (
            <TorneioCard
              key={t.id}
              torneio={t}
              numParticipantes={contagem[t.id] || 0}
              onClicar={setTorneioSelecionado}
              onRemover={setConfirmando}
            />
          ))}
        </div>
      )}

      {mostrarForm && (
        <TorneioForm
          usuarioId={usuarioLogado.id}
          onCriar={handleCriarTorneio}
          onFechar={() => setMostrarForm(false)}
        />
      )}

      {confirmando && (
        <ConfirmDialog
          mensagem={`Remover o torneio "${confirmando.nome}" e todos os seus participantes? Esta ação não pode ser desfeita.`}
          onConfirmar={confirmarRemocao}
          onCancelar={() => setConfirmando(null)}
        />
      )}
    </div>
  );
}

export default Home;
