const { ipcMain } = require('electron');
const { createMainWindow } = require('./janelaPrincipal');

const {
    buscarProdutos,
    adicionarProduto,
    atualizarProduto,
    deletarProduto
} = require('./produtos/produtoDb');

const {
    buscarProdutosCarinho,
    finalizarVenda
} = require('./vendas/vendaDb');  // <-- Corrigi também o caminho (use ./ em vez de src/)

const { validarLogin } = require('./login/loginDb');
const { modalAbrirVenda, modalAbrirProduto } = require('./janelamodal');

// ✅ Registrar handlers de venda
function registrarVendaHandler() {
    ipcMain.handle('buscar-produtos-carinho', buscarProdutosCarinho);
    ipcMain.handle('finalizar-venda', finalizarVenda);
}

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
