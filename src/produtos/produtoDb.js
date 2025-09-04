const db = require('../db');

// Buscar todos os produtos
async function buscarProdutos() {
    const resultado = await db.query(' select id, nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo FROM produtos ORDER BY id ASC');
    return resultado.rows;
}

// Deletar produto pelo ID
async function deletarProduto(id) {
    await db.query('DELETE FROM produtos WHERE id = $1', [id]);
}

// Atualizar produto
async function atualizarProduto(id, nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo) {
    await db.query(
        `UPDATE produtos 
         SET nome = $1, preco_venda = $2, preco_custo = $3, estoque = $4, tipo = $5, ativo_inativo = $6
         WHERE id = $7`,
        [nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo, id]
    );
}

// Adicionar novo produto
async function adicionarProduto(nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo) {
    const resultado = await db.query(
        `INSERT INTO produtos (nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo]
    );
    return resultado.rows[0]; // Retorna o produto inserido
}

module.exports = {
    buscarProdutos,
    deletarProduto,
    atualizarProduto,
    adicionarProduto
};
