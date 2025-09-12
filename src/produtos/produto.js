const tabelaProduto = document.getElementById("tabelaTableDados");
const ModalId = document.getElementById("ModalId");
const ModalNome = document.getElementById("ModalNome");
const ModalPrecoVenda = document.getElementById("ModalPrecoVenda");
const ModalPrecoCusto = document.getElementById("ModalPrecoCusto");
const ModalEstoque = document.getElementById("ModalEstoque");
const ModalTipo = document.getElementById("ModalTipo");
const ModalAtivoInativo = document.getElementById("ModalAtivoInativo");

// Botões
const botaoSalvarProduto = document.getElementById("btn-salvar");
const botaoExcluirProduto = document.getElementById("btn-excluir");
const botaoLimparProduto = document.getElementById("btn-limpar");

// Eventos
botaoExcluirProduto.addEventListener("click", excluirProduto);
botaoSalvarProduto.addEventListener("click", salvarProduto);
botaoLimparProduto.addEventListener("click", limparProduto);

// Exibir detalhes no modal
function mostrarDetalhesProduto(id, nome, precoVenda, precoCusto, estoque, tipo, ativoInativo) {
    ModalId.value = id;
    ModalNome.value = nome;
    ModalPrecoVenda.value = precoVenda;
    ModalPrecoCusto.value = precoCusto;
    ModalEstoque.value = estoque;
    ModalTipo.value = tipo;
    ModalAtivoInativo.value = ativoInativo;
}

// Limpar campos
function limparProduto() {
    mostrarDetalhesProduto("", "", "", "", "", "", "");
}

// Salvar (decide entre adicionar ou atualizar)
function salvarProduto() {
    const id = ModalId.value;
    if (id) {
        atualizarProduto();
    } else {
        adicionarProduto();
    }
}

// Adicionar produto
async function adicionarProduto() {

    const nome = ModalNome.value.trim();

    const precoVenda = parseFloat(ModalPrecoVenda.value) || 0;

    const precoCusto = parseFloat(ModalPrecoCusto.value) || 0;
    const estoque = parseInt(ModalEstoque.value) || 0;
    const tipo = ModalTipo.value.trim();
    const ativoInativo = ModalAtivoInativo.value;

    const retorno = await window.api.adicionarProduto(
        nome, precoVenda, precoCusto, estoque, tipo, ativoInativo
    );
    console.log(precoVenda);
    console.log(nome)
    console.log("Produto adicionado:", retorno);
    carregarProdutos();
    limparProduto();
}

// Atualizar produto
async function atualizarProduto() {
    const id = ModalId.value;
    const nome = ModalNome.value.trim();
    const precoVenda = parseFloat(ModalPrecoVenda.value) || 0;
    const precoCusto = parseFloat(ModalPrecoCusto.value) || 0;
    const estoque = parseInt(ModalEstoque.value) || 0;
    const tipo = ModalTipo.value.trim();
    const ativoInativo = ModalAtivoInativo.value;

    const retorno = await window.api.atualizarProduto(
        id, nome, precoVenda, precoCusto, estoque, tipo, ativoInativo
    );

    console.log("Produto atualizado:", retorno);
    carregarProdutos();
    limparProduto();
}

// Excluir produto
async function excluirProduto() {
    const id = ModalId.value;
    if (!id) return;

    const resultado = await window.api.deletarProduto(id);
    console.log("Produto excluído:", resultado);

    carregarProdutos();
    limparProduto();
}

// Criar linhas da tabela
function criarLinhaProduto(produto) {
    const linha = document.createElement("tr");

    const celulas = [
        produto.id,
        produto.nome,
        produto.preco_venda,
        produto.preco_custo,
        produto.estoque,
        produto.tipo,
        produto.ativo_inativo
    ];

    celulas.forEach(valor => {
        const td = document.createElement("td");
        td.textContent = valor;
        linha.appendChild(td);
    });

    // Botão editar
    const celulaBotao = document.createElement("td");
    const botao = document.createElement("button");
    botao.textContent = "Editar";
    botao.addEventListener("click", function () {
        mostrarDetalhesProduto(
            produto.id,
            produto.nome,
            produto.preco_venda,
            produto.preco_custo,
            produto.estoque,
            produto.tipo,
            produto.ativo_inativo
        );
    });

    celulaBotao.appendChild(botao);
    linha.appendChild(celulaBotao);

    tabelaProduto.appendChild(linha);
}

// Carregar produtos
async function carregarProdutos() {
    const listaProduto = await window.api.buscarProdutos();
    tabelaProduto.innerHTML = "";

    if (listaProduto.length > 0) {
        listaProduto.forEach(criarLinhaProduto);
    } else {
        tabelaProduto.textContent = "Nenhum produto encontrado.";
    }

    lucide.createIcons();
}

// Inicializa carregando produtos
carregarProdutos();
