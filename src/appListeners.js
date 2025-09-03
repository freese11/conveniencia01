const { contextBridge, ipcRenderer, ipcMain } = require('electron');

const {createMainWindow,createMainWindowUser} = require('./janelaPrincipal');


// const {
//     atualizarVenda,
//     BuscarVenda,
//     deletarVenda,
//     adicionarVenda,
    
// } = require('src/venda/vendaDb');

const {
    buscarProdutos,
    adicionarProduto,
    atualizarProduto,
    deletarProduto

} = require('../src/produtos/produtoDb');

// const {
//     buscarUsuario
// } = require('../src/usuario/usuarioDb');

const {
    validarLogin
}= require('../src/login/loginDb');

const {
modalAbrirVenda,
    modalAbrirProduto,
} = require('../src/janelamodal');

// const {
//     mostrarAlert,
//     mostrarConfirm
// } = require('./dialog/dialog')

// const {
//     adicionarCadastro
// } = require('./cadastro/cadastroDb')

function registrarJanelaDialog(){
    ipcMain.handle("dialog-alert", mostrarAlert),
    ipcMain.handle("dialog-confirm", mostrarConfirm)
}


function registrarJanelas(){
    ipcMain.on('abrir-venda',modalAbrirVenda),
    ipcMain.on('abrir-produto',modalAbrirProduto),
    ipcMain.on('abrir-menu',createMainWindow);
}


function registrarLoginHandler(){
    ipcMain.handle('validar-login',validarLogin);
}


function registrarProdutoHandler() {
    ipcMain.handle('buscar-produtos', buscarProdutos);
    ipcMain.handle('adicionar-produto', adicionarProduto);
    ipcMain.handle('atualizar-produto', atualizarProduto);
    ipcMain.handle('deletar-produto', deletarProduto);
}




function registrarTodos() {
    registrarProdutoHandler();
    registrarLoginHandler();
    registrarJanelas();
}

module.exports = {
    registrarTodos
};