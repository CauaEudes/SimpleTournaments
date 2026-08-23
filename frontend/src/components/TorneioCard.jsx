function TorneioCard({ torneio, numParticipantes, onClicar, onRemover }) {
  const statusMap = {
    aberto:       { texto: 'Aberto',       classe: 'status-aberto' },
    em_andamento: { texto: 'Em Andamento', classe: 'status-andamento' },
    finalizado:   { texto: 'Finalizado',   classe: 'status-finalizado' },
  };
  const { texto, classe } = statusMap[torneio.status] || { texto: torneio.status, classe: '' };

  return (
    <div
      className="torneio-card"
      onClick={() => onClicar(torneio.id)}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes do torneio ${torneio.nome}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClicar(torneio.id);
        }
      }}
    >
      <div className="torneio-card-body">
        <h3 className="torneio-card-title">{torneio.nome}</h3>
        <p className="torneio-card-desc">{torneio.descricao || 'Sem descrição'}</p>
        <div className="torneio-card-badges">
          <span className={`badge ${classe}`}>{texto}</span>
          {torneio.camposObrigatorios && (
            <span
              className="badge badge-info"
              title={`Exigências: ${torneio.camposObrigatorios}`}
            >
              📋 Requisitos
            </span>
          )}
        </div>
        <small className="torneio-card-meta">
          👥 {numParticipantes} participante(s) · 📅 {torneio.dataInicio}
        </small>
      </div>
      <div className="torneio-card-footer">
        <button
          className="btn-outline-danger btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemover(torneio);
          }}
          aria-label={`Remover torneio ${torneio.nome}`}
        >
          🗑️ Remover
        </button>
      </div>
    </div>
  );
}
export default TorneioCard;
