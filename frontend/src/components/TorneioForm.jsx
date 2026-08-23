import { useState } from 'react';

const CAMPOS_DISPONIVEIS = [
  { id: 'discord', label: 'Discord' },
  { id: 'email', label: 'E-mail' },
  { id: 'telefone', label: 'Telefone' },
];

function TorneioForm({ onCriar, onFechar, usuarioId }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [camposSelecionados, setCamposSelecionados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const hoje = new Date().toISOString().split('T')[0];

  function toggleCampo(campoId) {
    setCamposSelecionados((prev) =>
      prev.includes(campoId)
        ? prev.filter((c) => c !== campoId)
        : [...prev, campoId]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    if (!nome.trim()) {
      setErro('Preencha o nome do torneio.');
      return;
    }
    if (!dataInicio) {
      setErro('Selecione a data de início.');
      return;
    }
    setCarregando(true);
    try {
      await onCriar({
        nome: nome.trim(),
        descricao: descricao.trim(),
        dataInicio,
        camposObrigatorios: JSON.stringify(camposSelecionados),
        usuarioId,
      });
      onFechar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="form-title">
        <div className="modal-header">
          <h3 id="form-title">🏆 Novo Torneio</h3>
          <button className="btn-close" onClick={onFechar} aria-label="Fechar">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tor-nome">Nome do torneio</label>
            <input
              id="tor-nome"
              type="text"
              placeholder="Ex: Copa Campina 2026"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="tor-descricao">Descrição <span className="optional">(opcional)</span></label>
            <textarea
              id="tor-descricao"
              placeholder="Descreva o torneio, regras ou modalidade..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label htmlFor="tor-data">Data de início</label>
            <input
              id="tor-data"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              min={hoje}
              required
            />
          </div>
          <div className="form-group">
            <label>
              Campos obrigatórios na inscrição <span className="optional">(opcional)</span>
            </label>
            <div className="campos-obrigatorios-grid">
              {CAMPOS_DISPONIVEIS.map((campo) => (
                <label key={campo.id} className="checkbox-card">
                  <input
                    type="checkbox"
                    checked={camposSelecionados.includes(campo.id)}
                    onChange={() => toggleCampo(campo.id)}
                  />
                  <span className="checkbox-card-label">{campo.label}</span>
                </label>
              ))}
            </div>
            <small className="help-text" style={{ marginLeft: 0 }}>
              ℹ️ Os campos marcados serão obrigatórios na inscrição de cada participante.
            </small>
          </div>
          {erro && <p className="erro" role="alert">{erro}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onFechar}>Cancelar</button>
            <button type="submit" disabled={carregando} className="btn-primary">
              {carregando ? 'Criando...' : 'Criar Torneio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default TorneioForm;
