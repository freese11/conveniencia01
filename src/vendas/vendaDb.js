// vendas/vendaDb.js
const db = require('../db'); // ajuste o caminho conforme sua estrutura

// ------------------------
// Buscar produtos ativos
// ------------------------
async function buscarProdutosCarinho() {
  const resultado = await db.query(
    `SELECT id, nome, preco_venda, preco_custo, estoque, tipo, ativo_inativo 
     FROM produtos 
     WHERE ativo_inativo = 'Ativo'
     ORDER BY id ASC`
  );
  return resultado.rows;
}

// ------------------------
// Finalizar venda
// ------------------------
async function finalizarVenda(venda) {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Inserir venda
    const queryVenda = `
      INSERT INTO vendas (data, total, metodo_pagamento)
      VALUES (NOW(), $1, $2)
      RETURNING id
    `;
    const resVenda = await client.query(queryVenda, [
      venda.total,
      venda.metodoPagamento,
    ]);
    const vendaId = resVenda.rows[0].id;

    // 2. Inserir itens da venda e atualizar estoque
    for (const item of venda.itens) {
      await client.query(
        `INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        [vendaId, item.id, item.quantidade, item.preco]
      );

      await client.query(
        `UPDATE produtos SET estoque = estoque - $1 WHERE id = $2`,
        [item.quantidade, item.id]
      );
    }

    await client.query("COMMIT");
    return { success: true, message: "Venda registrada e estoque atualizado com sucesso!" };

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao registrar a venda:", err);
    return { success: false, message: "Falha ao registrar a venda. Tente novamente." };
  } finally {
    client.release();
  }
}

module.exports = {
  buscarProdutosCarinho,
  finalizarVenda,
};
