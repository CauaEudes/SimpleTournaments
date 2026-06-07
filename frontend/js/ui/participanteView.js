const form = document.querySelector('#form-participante');
const lista = document.querySelector('#lista-participantes');
function criarLinha(participante, aoRemover) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    const texto = document.createElement('div');
    texto.innerHTML = `<strong>${participante.nome}</strong>`;
    if (participante.email || participante.telefone) {
        texto.innerHTML += `<br><small class="text-muted">${participante.email || ''} ${participante.telefone ? '| ' + participante.telefone : ''}</small>`;
    }
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-outline-danger';
    btn.textContent = 'Remover';
    btn.addEventListener('click', () => aoRemover(participante.id));
    li.append(texto, btn);
    return li;
}
export const participanteView = {
    renderLista(participantes, aoRemover) {
        lista.innerHTML = '';
        if (participantes.length === 0) {
            lista.innerHTML = '<li class="list-group-item text-muted">Nenhum participante inscrito.</li>';
            return;
        }
        participantes.forEach(p => lista.appendChild(criarLinha(p, aoRemover)));
    },
    limparForm() {
        form.reset();
    },
    configurarFormulario(criacaoAvancada) {
        const camposAvancados = document.querySelectorAll('.campos-avancados');
        const inputEmail = document.querySelector('#part-email');
        const inputTelefone = document.querySelector('#part-telefone');
        camposAvancados.forEach(el => {
            if (criacaoAvancada) {
                el.classList.remove('d-none');
                inputEmail.required = true;
                inputTelefone.required = true;
            }
            else {
                el.classList.add('d-none');
                inputEmail.required = false;
                inputTelefone.required = false;
            }
        });
    },
    onSubmit(callback) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            callback({
                nome: document.querySelector('#part-nome').value,
                email: document.querySelector('#part-email').value,
                telefone: document.querySelector('#part-telefone').value,
            });
        });
    },
};
//# sourceMappingURL=participanteView.js.map