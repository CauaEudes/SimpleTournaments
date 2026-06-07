const grid = document.querySelector('#torneios-grid') as HTMLDivElement;
const form = document.querySelector('#form-torneio') as HTMLFormElement;
const detalheContainer = document.querySelector('#detalhe-torneio') as HTMLDivElement;

function formatarStatus(status: string): { texto: string; classe: string } {
  const mapa: Record<string, { texto: string; classe: string }> = {
    aberto:        { texto: 'Aberto',        classe: 'bg-success' },
    em_andamento:  { texto: 'Em Andamento',  classe: 'bg-warning text-dark' },
    finalizado:    { texto: 'Finalizado',    classe: 'bg-secondary' },
  };
  return mapa[status] || { texto: status, classe: 'bg-secondary' };
}

function criarCard(
  torneio: any,
  numParticipantes: number,
  aoClicar: (id: number) => void,
  aoRemover: (id: number) => void
): HTMLElement {
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4';

  const { texto, classe } = formatarStatus(torneio.status);

  const card = document.createElement('div');
  card.className = 'card h-100 torneio-card';
  card.addEventListener('click', () => aoClicar(torneio.id));

  card.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${torneio.nome}</h5>
      <p class="card-text text-muted small mb-2">${torneio.descricao || 'Sem descrição'}</p>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge ${classe}">${texto}</span>
        ${torneio.criacaoAvancada ? '<span class="badge bg-info text-dark">Avançado</span>' : ''}
      </div>
      <small class="text-muted">${numParticipantes} participante(s)</small>
    </div>
    <div class="card-footer d-flex justify-content-between align-items-center">
      <small class="text-muted">Início: ${torneio.dataInicio}</small>
    </div>
  `;

  const btnRemover = document.createElement('button');
  btnRemover.className = 'btn btn-sm btn-outline-danger';
  btnRemover.textContent = 'Remover';
  btnRemover.addEventListener('click', (e) => {
    e.stopPropagation();
    aoRemover(torneio.id);
  });

  card.querySelector('.card-footer')!.appendChild(btnRemover);

  col.appendChild(card);
  return col;
}

export const torneioView = {
  renderLista(
    torneios: any[],
    contagem: Map<number, number>,
    aoClicar: (id: number) => void,
    aoRemover: (id: number) => void
  ) {
    grid.innerHTML = '';
    if (torneios.length === 0) {
      grid.innerHTML = '<div class="col-12"><p class="text-muted text-center">Nenhum torneio criado ainda.</p></div>';
      return;
    }
    torneios.forEach(t => {
      const count = contagem.get(t.id) || 0;
      grid.appendChild(criarCard(t, count, aoClicar, aoRemover));
    });
  },

  renderDetalhe(torneio: any) {
    const { texto, classe } = formatarStatus(torneio.status);
    detalheContainer.innerHTML = `
      <div class="card-body">
        <h3 class="card-title">${torneio.nome}</h3>
        <p class="card-text">${torneio.descricao || 'Sem descrição'}</p>
        <div class="d-flex gap-3 align-items-center">
          <span class="badge ${classe}">${texto}</span>
          ${torneio.criacaoAvancada ? '<span class="badge bg-info text-dark">Avançado</span>' : ''}
          <small class="text-muted">Início: ${torneio.dataInicio}</small>
        </div>
      </div>
    `;
  },

  limparForm() {
    form.reset();
  },

  fecharModal() {
    const modalEl = document.querySelector('#modal-torneio') as HTMLElement;
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  },

  onSubmit(callback: (dados: any) => void) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      callback({
        nome:       (document.querySelector('#tor-nome') as HTMLInputElement).value,
        descricao:  (document.querySelector('#tor-descricao') as HTMLTextAreaElement).value,
        dataInicio: (document.querySelector('#tor-dataInicio') as HTMLInputElement).value,
        criacaoAvancada: (document.querySelector('#tor-avancada') as HTMLInputElement).checked,
      });
    });
  },
};
