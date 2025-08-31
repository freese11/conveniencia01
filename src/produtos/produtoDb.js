const db = require('../db');

// Buscar todos os produtos
async function buscarProdutos() {
    const resultado = await db.query('SELECT * FROM produtos ORDER BY codproduto ASC');
    return resultado.rows;
}

// Deletar produto pelo código
async function deletarProduto(event, codproduto) {
    event.preventDefault();
    await db.query('DELETE FROM produtos WHERE codproduto = $1', [codproduto]);
}

// Atualizar produto
async function atualizarProduto(event, codproduto, nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo) {
    await db.query(
        `UPDATE produtos 
         SET nome = $2, preco_venda = $3, preco_custo = $4, estoque = $5, tipo = $6, ativo_inativo = $7
         WHERE codproduto = $1`,
        [codproduto, nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo]
    );
}

// Adicionar novo produto
async function adicionarProduto(event, nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo) {
    const resultado = await db.query(
        `INSERT INTO produtos (nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING codproduto`,
        [nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo]
    );
    return resultado.rows[0]; // Retorna o produto inserido com o codproduto
}

module.exports = {
    buscarProdutos,
    deletarProduto,
    atualizarProduto,
    adicionarProduto
};
