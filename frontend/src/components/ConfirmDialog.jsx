function ConfirmDialog({ mensagem, onConfirmar, onCancelar }) {
  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-content confirm-dialog" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-labelledby="confirm-title" aria-describedby="confirm-msg">
        <h3 id="confirm-title">⚠️ Confirmação</h3>
        <p id="confirm-msg">{mensagem}</p>
        <div className="confirm-actions">
          <button className="btn-secondary" onClick={onCancelar} autoFocus>
            Cancelar
          </button>
          <button className="btn-danger" onClick={onConfirmar}>
            Confirmar exclusão
          </button>
        </div>
      </div>
    </div>
  );
}
export default ConfirmDialog;
