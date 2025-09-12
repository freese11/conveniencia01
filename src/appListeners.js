const { ipcMain } = require('electron');
const { createMainWindow } = require('./janelaPrincipal');

const {
    buscarProdutos,
    adicionarProduto,
    atualizarProduto,
    deletarProduto
} = require('./produtos/produtoDb');

const { validarLogin } = require('./login/loginDb');
const { modalAbrirVenda, modalAbrirProduto } = require('./janelamodal');

const { getProdutos, addVenda } = require('./vendas/vendaDb');

// ✅ Registrar handlers de venda

// ✅ Registrar handlers de produto
function registrarProdutoHandler() {
    ipcMain.handle('buscar-produtos', buscarProdutos);
    ipcMain.handle('adicionar-produtos', adicionarProduto);
    ipcMain.handle('atualizar-produto', atualizarProduto);
    ipcMain.handle('deletar-produto', deletarProduto);
}

// ✅ Registrar janelas
function registrarJanelas() {
    ipcMain.on('abrir-venda', modalAbrirVenda);
    ipcMain.on('abrir-produto', modalAbrirProduto);
    ipcMain.on('abrir-menu', createMainWindow);
}

// ✅ Registrar login
function registrarLoginHandler() {
    ipcMain.handle('validar-login', validarLogin);
}

// ✅ Função geral
function registrarTodos() {
    registrarProdutoHandler();
    registrarLoginHandler();
    registrarJanelas();
    registrarVendaHandler();
}

module.exports = {
    registrarTodos
};
