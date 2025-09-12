// vendasdb.js

const { Pool } = require('pg');

// Busca todos os produtos para a tela de vendas
async function buscarProdutos() {
  try {
    const res = await pool.query('SELECT id, nome, preco_venda, estoque FROM produtos WHERE ativo_inativo = true ORDER BY nome ASC');
    return res.rows;
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    throw new Error('Não foi possível carregar os produtos.');
  }
}

// Finaliza uma nova venda no banco de dados
async function finalizarVenda(venda) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insere a venda na tabela 'vendas'
    const queryVenda = 'INSERT INTO vendas (valortotal, status, metodo_pagamento, data) VALUES ($1, $2, $3, NOW()) RETURNING id';
    const resVenda = await client.query(queryVenda, [venda.total, 'finalizada', venda.metodoPagamento]);
    const vendaId = resVenda.rows[0].id;

    // 2. Insere os itens da venda na tabela 'venda_itens'
    for (const item of venda.itens) {
      const queryItem = 'INSERT INTO venda_itens (venda_id, produto_id, quantidade, preco_unit) VALUES ($1, $2, $3, $4)';
      await client.query(queryItem, [vendaId, item.id, item.quantidade, item.preco]);

      // 3. Atualiza o estoque do produto
      const queryEstoque = 'UPDATE produtos SET estoque = estoque - $1 WHERE id = $2';
      await client.query(queryEstoque, [item.quantidade, item.id]);
    }

    await client.query('COMMIT');
    return { success: true, message: 'Venda registrada e estoque atualizado com sucesso!' };

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao registrar a venda:', err);
    return { success: false, message: 'Falha ao registrar a venda. Tente novamente.' };
  } finally {
    client.release();
  }
}

// Adicione aqui suas outras funções de banco de dados
// Exemplo:
async function adicionarProduto(nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo) {
  try {
    const res = await pool.query('INSERT INTO produtos (nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo]);
    return res.rows[0];
  } catch (err) {
    console.error('Erro ao adicionar produto:', err);
    throw err;
  }
}

// Exporta as funções para serem usadas no applisteners
module.exports = {
  buscarProdutos,
  finalizarVenda,
  adicionarProduto, // Exemplo de outra função
  // ... exporte aqui todas as funções que você precisar
};