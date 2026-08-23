import { useState, useEffect, useRef } from 'react';
import {
  buscarTorneio,
  listarParticipantes,
  criarParticipante,
  removerParticipante,
  gerarConfrontos,
  listarConfrontos,
  registrarPlacar,
  resetarConfrontos,
  atualizarTorneio,
} from '../services/api';
import ConfirmDialog from './ConfirmDialog';

const CAMPOS_LABELS = {
  discord: 'Discord',
  email: 'E-mail',
  telefone: 'Telefone',
};

function TorneioDetalhe({ torneioId, onVoltar }) {
  const [torneio, setTorneio] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [confirmando, setConfirmando] = useState(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [discord, setDiscord] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  const [confrontos, setConfrontos] = useState(null);
  const [classificacao, setClassificacao] = useState([]);
  const [gerandoConfrontos, setGerandoConfrontos] = useState(false);
  const [placares, setPlacares] = useState({});
  const [salvandoPlacar, setSalvandoPlacar] = useState(null);
  const [confirmandoReset, setConfirmandoReset] = useState(false);
  const [confirmandoGerar, setConfirmandoGerar] = useState(false);
  const [confirmandoFinalizar, setConfirmandoFinalizar] = useState(false);
  const [finalizandoTorneio, setFinalizandoTorneio] = useState(false);

  const tituloRef = useRef(null);
  const buscaRef = useRef(null);

  function getCamposObrigatorios() {
    if (!torneio?.camposObrigatorios) return [];
    try {
      const parsed = JSON.parse(torneio.camposObrigatorios);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async function carregar(silencioso = false) {
    if (!silencioso) {
      setCarregando(true);
    }
    setErro('');
    try {
      const [t, p] = await Promise.all([
        buscarTorneio(torneioId),
        listarParticipantes(torneioId),
      ]);
      setTorneio(t);
      setParticipantes(p);

      try {
        const resultado = await listarConfrontos(torneioId);
        if (resultado.partidas && resultado.partidas.length > 0) {
          setConfrontos(resultado.partidas);
          setClassificacao(resultado.classificacao);
        } else {
          setConfrontos(null);
          setClassificacao([]);
        }
      } catch {
        setConfrontos(null);
        setClassificacao([]);
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      if (!silencioso) {
        setCarregando(false);
      }
    }
  }

  useEffect(() => {
    carregar(false);
  }, [torneioId]);

  async function handleAdicionarParticipante(e) {
    e.preventDefault();
    setErroForm('');
    if (!nome.trim()) {
      setErroForm('Preencha o nome do participante.');
      return;
    }

    const campos = getCamposObrigatorios();
    const valoresMap = { discord, email, telefone };
    for (const campo of campos) {
      if (!valoresMap[campo] || !valoresMap[campo].trim()) {
        setErroForm(`Preencha o campo "${CAMPOS_LABELS[campo] || campo}".`);
        return;
      }
    }

    setSalvando(true);
    try {
      await criarParticipante({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        discord: discord.trim(),
        torneioId,
      });
      setNome('');
      setEmail('');
      setTelefone('');
      setDiscord('');
      await carregar(true);
    } catch (err) {
      setErroForm(err.message);
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarRemocao() {
    if (!confirmando) return;
    setErro('');
    try {
      await removerParticipante(confirmando.id);
      setConfirmando(null);
      await carregar(true);
      if (buscaRef.current) buscaRef.current.focus();
    } catch (err) {
      setErro(err.message);
      setConfirmando(null);
    }
  }

  async function handleGerarConfrontos() {
    setGerandoConfrontos(true);
    setErro('');
    try {
      await gerarConfrontos(torneioId, {});
      setConfirmandoGerar(false);
      await carregar(true);
    } catch (err) {
      setErro(err.message);
      setConfirmandoGerar(false);
    } finally {
      setGerandoConfrontos(false);
    }
  }

  async function handleRegistrarPlacar(partidaId) {
    const placar = placares[partidaId];
    if (!placar || placar.p1 === '' || placar.p2 === '') return;

    const p1 = Number(placar.p1);
    const p2 = Number(placar.p2);
    if (isNaN(p1) || isNaN(p2) || p1 < 0 || p2 < 0) return;

    setSalvandoPlacar(partidaId);
    try {
      await registrarPlacar(partidaId, p1, p2);
      await carregar(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvandoPlacar(null);
    }
  }

  async function handleResetarConfrontos() {
    setErro('');
    try {
      await resetarConfrontos(torneioId);
      setConfirmandoReset(false);
      setPlacares({});
      await carregar(true);
    } catch (err) {
      setErro(err.message);
      setConfirmandoReset(false);
    }
  }

  async function handleAlternarStatusTorneio(novoStatus) {
    setFinalizandoTorneio(true);
    setErro('');
    try {
      await atualizarTorneio(torneioId, { status: novoStatus });
      setConfirmandoFinalizar(false);
      await carregar(true);
    } catch (err) {
      setErro(err.message);
      setConfirmandoFinalizar(false);
    } finally {
      setFinalizandoTorneio(false);
    }
  }

  function setPlacar(partidaId, campo, valor) {
    setPlacares((prev) => ({
      ...prev,
      [partidaId]: {
        ...prev[partidaId],
        [campo]: valor,
      },
    }));
  }

  if (carregando) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Carregando torneio...</p>
      </div>
    );
  }

  if (erro && !torneio) {
    return (
      <div className="card">
        <p className="erro" role="alert">{erro}</p>
        <button className="btn-secondary" onClick={onVoltar}>← Voltar</button>
      </div>
    );
  }

  const statusMap = {
    aberto:       { texto: 'Aberto',       classe: 'status-aberto' },
    em_andamento: { texto: 'Em Andamento', classe: 'status-andamento' },
    finalizado:   { texto: 'Finalizado',   classe: 'status-finalizado' },
  };
  const { texto, classe } = statusMap[torneio.status] || { texto: torneio.status, classe: '' };

  const filtrados = participantes.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (p.discord && p.discord.toLowerCase().includes(busca.toLowerCase())) ||
    (p.email && p.email.toLowerCase().includes(busca.toLowerCase()))
  );

  const campos = getCamposObrigatorios();
  const temConfrontos = confrontos && confrontos.length > 0;
  const totalFinalizadas = temConfrontos ? confrontos.filter(p => p.finalizada).length : 0;
  const totalPartidas = temConfrontos ? confrontos.length : 0;
  const isFinalizado = torneio.status === 'finalizado';

  return (
    <div>
      <button className="btn-back" onClick={onVoltar}>← Voltar aos torneios</button>

      <div className="card torneio-detalhe-header">
        <h2 ref={tituloRef}>{torneio.nome}</h2>
        <p className="torneio-desc">{torneio.descricao || 'Sem descrição'}</p>
        <div className="torneio-card-badges">
          <span className={`badge ${classe}`}>{texto}</span>
          <span className="badge badge-meta">📅 Início: {torneio.dataInicio}</span>
        </div>
        {campos.length > 0 && (
          <div className="requisitos-banner" role="note">
            <strong>📋 Campos obrigatórios na inscrição:</strong>
            <div className="campos-badges">
              {campos.map((c) => (
                <span key={c} className="badge badge-info">{CAMPOS_LABELS[c] || c}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {erro && <p className="erro toast-erro" role="alert">{erro}</p>}

      {/* ── Seção Participantes ── */}
      <div className="card participantes-section">
        <h3>👥 Inscrição e Participantes ({participantes.length})</h3>

        {!temConfrontos && !isFinalizado && (
          <form onSubmit={handleAdicionarParticipante} className="form-compacto">
            <div className="form-compacto-inputs">
              <div className="input-group-compact">
                <input
                  id="part-nome"
                  type="text"
                  placeholder="Nome do participante *"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              {campos.includes('discord') && (
                <div className="input-group-compact">
                  <input
                    id="part-discord"
                    type="text"
                    placeholder="Discord *"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    required
                  />
                </div>
              )}

              {campos.includes('email') && (
                <div className="input-group-compact">
                  <input
                    id="part-email"
                    type="email"
                    placeholder="E-mail *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}

              {campos.includes('telefone') && (
                <div className="input-group-compact">
                  <input
                    id="part-tel"
                    type="tel"
                    placeholder="Telefone *"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Se o torneio não configurou nenhum campo obrigatório específico, permite e-mail opcional */}
              {campos.length === 0 && (
                <>
                  <div className="input-group-compact">
                    <input
                      id="part-email"
                      type="email"
                      placeholder="E-mail (opcional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-group-compact">
                    <input
                      id="part-tel"
                      type="tel"
                      placeholder="Telefone (opcional)"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                    />
                  </div>
                </>
              )}

              <button type="submit" disabled={salvando} className="btn-primary btn-add-compact">
                {salvando ? '...' : '+ Inscrever'}
              </button>
            </div>
          </form>
        )}

        {temConfrontos && (
          <p className="info-confrontos-gerados">
            🔒 Inscrições encerradas — confrontos já foram gerados.
          </p>
        )}

        {erroForm && <p className="erro" role="alert" style={{ marginBottom: '12px' }}>{erroForm}</p>}

        {participantes.length > 0 && (
          <div className="form-group search-group" style={{ marginBottom: '12px' }}>
            <label htmlFor="busca-part">Buscar participante</label>
            <input
              id="busca-part"
              ref={buscaRef}
              type="text"
              placeholder="Filtrar por nome ou dados..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        )}

        <ul className="participantes-lista" aria-live="polite">
          {filtrados.length === 0 && (
            <li className="lista-vazia">
              {participantes.length === 0
                ? 'Nenhum participante inscrito ainda.'
                : 'Nenhum resultado para a busca.'}
            </li>
          )}
          {filtrados.map((p) => (
            <li key={p.id} className="participante-item">
              <div className="participante-info">
                <strong>{p.nome}</strong>
                {p.discord && (
                  <small className="info-obrigatoria">
                    💬 <span>{p.discord}</span>
                  </small>
                )}
                {(p.email || p.telefone) && (
                  <small>
                    {p.email && <span>📧 {p.email}</span>}
                    {p.telefone && <span>📱 {p.telefone}</span>}
                  </small>
                )}
              </div>
              {!temConfrontos && !isFinalizado && (
                <button
                  className="btn-outline-danger btn-sm"
                  onClick={() => setConfirmando(p)}
                  aria-label={`Remover participante ${p.nome}`}
                >
                  🗑️
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Seção Confrontos ── */}
      <div className="card confrontos-section">
        <div className="confrontos-header">
          <h3>⚔️ Confrontos {temConfrontos ? `(${totalFinalizadas}/${totalPartidas} finalizadas)` : ''}</h3>
          {temConfrontos && !isFinalizado && (
            <button className="btn-outline-danger btn-sm" onClick={() => setConfirmandoReset(true)}>
              🔄 Resetar
            </button>
          )}
        </div>

        {!temConfrontos ? (
          <div className="gerar-confrontos-area">
            <p className="texto-gerar">
              {participantes.length < 2
                ? 'Inscreva pelo menos 2 participantes para gerar os confrontos.'
                : `Pronto para gerar ${participantes.length * (participantes.length - 1) / 2} confrontos (todos contra todos embaralhados).`}
            </p>
            {participantes.length >= 2 && !isFinalizado && (
              <button
                className="btn-primary btn-gerar"
                onClick={() => setConfirmandoGerar(true)}
                disabled={gerandoConfrontos}
              >
                {gerandoConfrontos ? 'Gerando...' : '⚔️ Gerar Confrontos'}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Cards de partidas */}
            <div className="confrontos-grid">
              {confrontos.map((partida) => (
                <div key={partida.id} className={`confronto-card ${partida.finalizada ? 'finalizada' : ''}`}>
                  <div className="confronto-jogadores">
                    <span className={`jogador ${partida.finalizada && partida.placar1 > partida.placar2 ? 'vencedor' : ''}`}>
                      {partida.nomeParticipante1}
                    </span>
                    <span className="confronto-vs">×</span>
                    <span className={`jogador ${partida.finalizada && partida.placar2 > partida.placar1 ? 'vencedor' : ''}`}>
                      {partida.nomeParticipante2}
                    </span>
                  </div>

                  {partida.finalizada ? (
                    <div className="confronto-resultado">
                      <span className="placar-final">{partida.placar1}</span>
                      <span className="placar-separador">-</span>
                      <span className="placar-final">{partida.placar2}</span>
                      <span className="badge-finalizada">✅</span>
                    </div>
                  ) : (
                    <div className="confronto-placar-form">
                      <input
                        type="number"
                        min="0"
                        className="placar-input"
                        placeholder="0"
                        value={placares[partida.id]?.p1 ?? ''}
                        onChange={(e) => setPlacar(partida.id, 'p1', e.target.value)}
                        disabled={isFinalizado}
                      />
                      <span className="placar-separador">-</span>
                      <input
                        type="number"
                        min="0"
                        className="placar-input"
                        placeholder="0"
                        value={placares[partida.id]?.p2 ?? ''}
                        onChange={(e) => setPlacar(partida.id, 'p2', e.target.value)}
                        disabled={isFinalizado}
                      />
                      {!isFinalizado && (
                        <button
                          className="btn-primary btn-sm btn-salvar-placar"
                          onClick={() => handleRegistrarPlacar(partida.id)}
                          disabled={
                            salvandoPlacar === partida.id ||
                            placares[partida.id]?.p1 === undefined ||
                            placares[partida.id]?.p1 === '' ||
                            placares[partida.id]?.p2 === undefined ||
                            placares[partida.id]?.p2 === ''
                          }
                          title="Salvar placar"
                        >
                          {salvandoPlacar === partida.id ? '...' : '✓'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tabela de classificação */}
            {classificacao.length > 0 && (
              <div className="classificacao-section">
                <h4>📊 Classificação</h4>
                <div className="tabela-classificacao-wrapper">
                  <table className="tabela-classificacao">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Participante</th>
                        <th>P</th>
                        <th>V</th>
                        <th>E</th>
                        <th>D</th>
                        <th>GP</th>
                        <th>GC</th>
                        <th>SG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classificacao.map((item, index) => (
                        <tr key={item.id} className={index === 0 && totalFinalizadas > 0 ? 'primeiro-lugar' : ''}>
                          <td className="posicao">{index + 1}</td>
                          <td className="nome-classificacao">{item.nome}</td>
                          <td className="pontos"><strong>{item.pontos}</strong></td>
                          <td>{item.vitorias}</td>
                          <td>{item.empates}</td>
                          <td>{item.derrotas}</td>
                          <td>{item.golsPro}</td>
                          <td>{item.golsContra}</td>
                          <td className={item.saldo > 0 ? 'saldo-positivo' : item.saldo < 0 ? 'saldo-negativo' : ''}>
                            {item.saldo > 0 ? `+${item.saldo}` : item.saldo}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <small className="legenda-pontos">Vitória = +3 · Empate = +1 · Derrota = 0</small>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Seção Final de Ações do Torneio (Finalizar / Reabrir) ── */}
      <div className="card torneio-finalizar-section">
        {isFinalizado ? (
          <div className="finalizado-banner">
            <div className="finalizado-info">
              <span className="trofeu-icone">🏆</span>
              <div>
                <strong>Torneio Finalizado!</strong>
                <p>
                  {classificacao.length > 0
                    ? `Campeão: ${classificacao[0].nome} (${classificacao[0].pontos} pts)`
                    : 'Este torneio foi marcado como finalizado.'}
                </p>
              </div>
            </div>
            <button
              className="btn-secondary btn-sm"
              onClick={() => handleAlternarStatusTorneio('em_andamento')}
              disabled={finalizandoTorneio}
            >
              🔓 Reabrir Torneio
            </button>
          </div>
        ) : (
          <div className="finalizar-acoes">
            <p className="texto-status">
              Status atual: <span className={`badge ${classe}`}>{texto}</span>
            </p>
            <button
              className="btn-danger btn-finalizar"
              onClick={() => setConfirmandoFinalizar(true)}
              disabled={finalizandoTorneio}
            >
              🏁 Finalizar Torneio
            </button>
          </div>
        )}
      </div>

      {/* Dialogs de confirmação */}
      {confirmando && (
        <ConfirmDialog
          mensagem={`Remover o participante "${confirmando.nome}" deste torneio?`}
          onConfirmar={confirmarRemocao}
          onCancelar={() => setConfirmando(null)}
        />
      )}

      {confirmandoReset && (
        <ConfirmDialog
          mensagem="Resetar todos os confrontos e resultados? Esta ação não pode ser desfeita."
          onConfirmar={handleResetarConfrontos}
          onCancelar={() => setConfirmandoReset(false)}
        />
      )}

      {confirmandoGerar && (
        <ConfirmDialog
          mensagem={`Gerar todos os ${participantes.length * (participantes.length - 1) / 2} confrontos embaralhados para os ${participantes.length} participantes? As inscrições serão encerradas.`}
          onConfirmar={handleGerarConfrontos}
          onCancelar={() => setConfirmandoGerar(false)}
        />
      )}

      {confirmandoFinalizar && (
        <ConfirmDialog
          mensagem="Deseja encerrar e finalizar este torneio? O status será alterado para Finalizado."
          onConfirmar={() => handleAlternarStatusTorneio('finalizado')}
          onCancelar={() => setConfirmandoFinalizar(false)}
        />
      )}
    </div>
  );
}
export default TorneioDetalhe;
