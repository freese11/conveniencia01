// vendasdb.js
const db = require('../db'); // ajuste o caminho conforme a estrutura do seu projeto

// Buscar todos os produtos
async function buscarProdutosCarinho() {
  const resultado = await db.query(
    'SELECT id, nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo FROM produtos ORDER BY id ASC'
  );
  return resultado.rows;
}

// Finaliza uma nova venda no banco de dados
async function finalizarVenda(venda) {
  const client = await db.pool.connect(); // precisamos do pool para transações
  try {
    await client.query('BEGIN');

    const queryVenda =
      'INSERT INTO vendas (valortotal, status, metodo_pagamento, data) VALUES ($1, $2, $3, NOW()) RETURNING id';
    const resVenda = await client.query(queryVenda, [
      venda.total,
      'finalizada',
      venda.metodoPagamento,
    ]);
    const vendaId = resVenda.rows[0].id;

    for (const item of venda.itens) {
      const queryItem =
        'INSERT INTO venda_itens (venda_id, produto_id, quantidade, preco_unit) VALUES ($1, $2, $3, $4)';
      await client.query(queryItem, [
        vendaId,
        item.id,
        item.quantidade,
        item.preco,
      ]);

      const queryEstoque =
        'UPDATE produtos SET estoque = estoque - $1 WHERE id = $2';
      await client.query(queryEstoque, [item.quantidade, item.id]);
    }

    await client.query('COMMIT');
    return {
      success: true,
      message: 'Venda registrada e estoque atualizado com sucesso!',
    };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao registrar a venda:', err);
    return {
      success: false,
      message: 'Falha ao registrar a venda. Tente novamente.',
    };
  } finally {
    client.release();
  }
}

// Exporta as funções para serem usadas no applisteners
module.exports = {
  buscarProdutosCarinho,
  finalizarVenda,
};
