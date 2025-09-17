// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // Funções de diálogo
  dialogAlert: (mensagem) => ipcRenderer.invoke("dialog-alert", mensagem),
  dialogConfirm: (mensagem) => ipcRenderer.invoke("dialog-confirm", mensagem),

  // Funções de usuário e cadastro
  adicionarCadastro: (nome, email, numero, senha, perfil) => ipcRenderer.invoke("cadastro-usuario", nome, email, numero, senha, perfil),
  abrirJanelaCadastro: () => ipcRenderer.send("abrir-cadastro"),
  buscarUsuario: () => ipcRenderer.invoke("buscar-usuario"),

  // Funções de produto
  buscarProdutos: () => ipcRenderer.invoke("buscar-produtos"),
  adicionarProduto: (nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo) => ipcRenderer.invoke("adicionar-produtos", nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo),
  atualizarProduto: (id, nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo) => ipcRenderer.invoke("atualizar-produto", id, nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo),
  deletarProduto: (id) => ipcRenderer.invoke("deletar-produto", id),

  // Funções de venda
  buscarProdutosCarinho: () => ipcRenderer.invoke("buscar-produtos-carinho"),
  finalizarVenda: (venda) => ipcRenderer.invoke("finalizar-venda", venda),
  
  // Funções de navegação e login
  abrirVenda: () => ipcRenderer.send("abrir-venda"),
  abrirProduto: () => ipcRenderer.send("abrir-produto"),
  abrirJanelaPrincipal: () => ipcRenderer.send("abrir-menu"),
  validarLogin: (usuario, senha) => ipcRenderer.invoke("validar-login", usuario, senha)
});