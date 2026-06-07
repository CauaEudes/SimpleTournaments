import { torneioService } from './services/torneioService.js';
import { participanteService } from './services/participanteService.js';
import { torneioView } from './ui/torneioView.js';
import { participanteView } from './ui/participanteView.js';

const alerta = document.querySelector('#alerta') as HTMLDivElement;
const viewLista = document.querySelector('#view-lista') as HTMLElement;
const viewDetalhe = document.querySelector('#view-detalhe') as HTMLElement;
const btnVoltar = document.querySelector('#btn-voltar') as HTMLButtonElement;

const inputBuscaTorneio = document.querySelector('#busca-torneio') as HTMLInputElement;
const inputBuscaParticipante = document.querySelector('#busca-participante') as HTMLInputElement;

let torneioAtualId: number | null = null;

let todosTorneios: any[] = [];
let todosParticipantesGlobais: any[] = [];
let participantesDoTorneio: any[] = [];
let contagemParticipantes = new Map<number, number>();

inputBuscaTorneio.addEventListener('input', renderizarTorneiosFiltrados);
inputBuscaParticipante.addEventListener('input', renderizarParticipantesFiltrados);

function renderizarTorneiosFiltrados() {
  const termo = inputBuscaTorneio.value.toLowerCase();
  const filtrados = todosTorneios.filter(t => t.nome.toLowerCase().includes(termo));
  torneioView.renderLista(filtrados, contagemParticipantes, navegarParaDetalhe, removerTorneio);
}

function renderizarParticipantesFiltrados() {
  const termo = inputBuscaParticipante.value.toLowerCase();
  const filtrados = participantesDoTorneio.filter(p => p.nome.toLowerCase().includes(termo));
  participanteView.renderLista(filtrados, removerParticipante);
}

function mostrarErro(msg: string) {
  alerta.textContent = msg;
  alerta.classList.remove('d-none');
}

function limparErro() {
  alerta.classList.add('d-none');
  alerta.textContent = '';
}

function navegarParaLista() {
  viewLista.classList.remove('d-none');
  viewDetalhe.classList.add('d-none');
  torneioAtualId = null;
  limparErro();
  atualizarTorneios();
}

async function navegarParaDetalhe(id: number) {
  torneioAtualId = id;
  viewLista.classList.add('d-none');
  viewDetalhe.classList.remove('d-none');
  limparErro();
  await atualizarDetalhe();
}

async function atualizarTorneios() {
  try {
    todosTorneios = await torneioService.listar();
    todosParticipantesGlobais = await participanteService.listarTodos();

    contagemParticipantes.clear();
    todosParticipantesGlobais.forEach((p: any) => {
      contagemParticipantes.set(p.torneioId, (contagemParticipantes.get(p.torneioId) || 0) + 1);
    });

    renderizarTorneiosFiltrados();
  } catch (err: any) {
    mostrarErro(err.message);
  }
}

async function criarTorneio(dados: any) {
  limparErro();
  try {
    await torneioService.criar(dados);
    torneioView.limparForm();
    torneioView.fecharModal();
    await atualizarTorneios();
  } catch (err: any) { mostrarErro(err.message); }
}

async function removerTorneio(id: number) {
  limparErro();
  try {
    await torneioService.remover(id);
    await atualizarTorneios();
  } catch (err: any) { mostrarErro(err.message); }
}

async function atualizarDetalhe() {
  if (!torneioAtualId) return;
  try {
    const torneio = await torneioService.buscar(torneioAtualId);
    participantesDoTorneio = await participanteService.listarPorTorneio(torneioAtualId);
    torneioView.renderDetalhe(torneio);
    participanteView.configurarFormulario(torneio.criacaoAvancada);
    renderizarParticipantesFiltrados();
  } catch (err: any) { mostrarErro(err.message); }
}

async function criarParticipante(dados: any) {
  limparErro();
  if (!torneioAtualId) return;
  try {
    await participanteService.criar({ ...dados, torneioId: torneioAtualId });
    participanteView.limparForm();
    await atualizarDetalhe();
  } catch (err: any) { mostrarErro(err.message); }
}

async function removerParticipante(id: number) {
  limparErro();
  try {
    await participanteService.remover(id);
    await atualizarDetalhe();
  } catch (err: any) { mostrarErro(err.message); }
}

btnVoltar.addEventListener('click', navegarParaLista);
torneioView.onSubmit(criarTorneio);
participanteView.onSubmit(criarParticipante);

async function iniciar() {
  try {
    await atualizarTorneios();
  } catch (err: any) {
    mostrarErro('Não consegui falar com a API. O backend está rodando em :3000?');
  }
}

iniciar();
