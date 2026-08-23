import { usuarioModel } from '../models/usuario';

export const usuarioService = {
  listarTodos() {
    return usuarioModel.listarTodos();
  },

  cadastrar(dados: { nome?: string; email?: string; senha?: string }) {
    if (!dados.nome || !dados.email || !dados.senha) {
      const err = new Error('Preencha todos os campos: nome, e-mail e senha.') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    const existente = usuarioModel.buscarPorEmail(dados.email);
    if (existente) {
      const err = new Error('Este e-mail já está cadastrado. Tente outro.') as Error & { status: number };
      err.status = 409;
      throw err;
    }

    return usuarioModel.inserir({
      nome: dados.nome.trim(),
      email: dados.email.trim().toLowerCase(),
      senha: dados.senha,
    });
  },

  login(dados: { email?: string; senha?: string }) {
    if (!dados.email || !dados.senha) {
      const err = new Error('Informe e-mail e senha para entrar.') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    const usuario = usuarioModel.buscarPorEmail(dados.email.trim().toLowerCase());
    if (!usuario || usuario.senha !== dados.senha) {
      const err = new Error('E-mail ou senha inválidos.') as Error & { status: number };
      err.status = 401;
      throw err;
    }

    const { senha: _, ...semSenha } = usuario;
    return semSenha;
  },
};
