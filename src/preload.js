const { contextBridge, ipcRenderer } = require("electron");

// Funções de diálogo
function registrarDialogAlert(mensagem) {
    return ipcRenderer.invoke("dialog-alert", mensagem);
}

function registrarDialogConfirm(mensagem) {
    return ipcRenderer.invoke("dialog-confirm", mensagem);
}

// Funções de cadastro
function adicionarCadastro(nome, email, numero, senha, perfil) {
    return ipcRenderer.invoke("cadastro-usuario", nome, email, numero, senha, perfil);
}

function abrirJanelaCadastro() {
    return ipcRenderer.send("abrir-cadastro");
}

// Funções de Produto (AJUSTADAS)
function buscarProdutos() {
    return ipcRenderer.invoke("buscar-produtos");
}

function adicionarProduto(nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo) {
    return ipcRenderer.invoke(
        "adicionar-produto",
        nome,
        preco_venda,
        preco_custo,
        estoque,
        tipo,
        ativo_inativo
    );
}

function atualizarProduto(id, nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo) {
    return ipcRenderer.invoke(
        "atualizar-produto",
        id,
        nome,
        preco_venda,
        preco_custo,
        estoque,
        tipo,
        ativo_inativo
    );
}

function deletarProduto(id) {
    return ipcRenderer.invoke("deletar-produto", id);
}

// Funções de Usuário
function buscarUsuario() {
    return ipcRenderer.invoke("buscar-usuario");
}

// Funções de Venda
function BuscarVenda() {
    return ipcRenderer.invoke("buscar-venda");
}

function deletarVenda(codvenda) {
    return ipcRenderer.invoke("deletar-venda", codvenda);
}

function atualizarVenda(codvenda, codcliente, codproduto, codusuario, status, valortotal, data) {
    return ipcRenderer.invoke(
        "atualizar-venda",
        codvenda,
        codcliente,
        codproduto,
        codusuario,
        status,
        valortotal,
        data
    );
}

function adicionarVenda(codcliente, codproduto, codusuario, status, valortotal, data) {
    return ipcRenderer.invoke(
        "adicionar-venda",
        codcliente,
        codproduto,
        codusuario,
        status,
        valortotal,
        data
    );
}

// Abertura de janelas
function abrirVenda() {
    return ipcRenderer.send("abrir-venda");
}

function abrirProduto() {
    return ipcRenderer.send("abrir-produto");
}

// Login
function validarLogin(usuario, senha) {
    return ipcRenderer.invoke("validar-login", usuario, senha);
}

function abrirJanelaPrincipal() {
    return ipcRenderer.send("abrir-menu");
}

// Expondo funções no contexto seguro
contextBridge.exposeInMainWorld("api", {
    registrarDialogAlert,
    registrarDialogConfirm,

    adicionarCadastro,
    abrirJanelaCadastro,

    buscarProdutos,
    adicionarProduto,
    atualizarProduto,
    deletarProduto,

    buscarUsuario,

    abrirVenda,
    BuscarVenda,
    adicionarVenda,
    atualizarVenda,
    deletarVenda,

    abrirJanelaPrincipal,
    validarLogin,
    abrirProduto
});
