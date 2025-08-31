const tabelaProduto = document.getElementById("tabelaTableDados");
const ModalCodproduto = document.getElementById("ModalCodproduto");
const ModalNome = document.getElementById("ModalNome");
const ModalPrecoVenda = document.getElementById("ModalpreçoVenda");
const ModalPrecoCusto = document.getElementById("ModalpreçoCusto");
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
function mostrarDetalhesProduto(codproduto, nome, precoVenda, precoCusto, estoque, tipo, ativoInativo) {
    ModalCodproduto.value = codproduto;
    ModalNome.value = nome;
    ModalPrecoVenda.value = precoVenda;
    ModalPrecoCusto.value = precoCusto;
    ModalEstoque.value = estoque;
    ModalTipo.value = tipo;
    ModalAtivoInativo.value = ativoInativo;
}

// Limpar campos
function limparProduto() {
    mostrarDetalhesProduto("", "", "", "", "", "", "Ativo");
}

// Salvar (decide entre adicionar ou atualizar)
function salvarProduto() {
    const codproduto = ModalCodproduto.value;
    if (codproduto) {
        atualizarProduto();
    } else {
        adicionarProduto();
    }
}

// Adicionar produto
async function adicionarProduto() {
    const nome = ModalNome.value;
    const precoVenda = ModalPrecoVenda.value;
    const precoCusto = ModalPrecoCusto.value;
    const estoque = ModalEstoque.value;
    const tipo = ModalTipo.value;
    const ativoInativo = ModalAtivoInativo.value;

    const retorno = await window.api.adicionarProduto(
        nome, precoVenda, precoCusto, estoque, tipo, ativoInativo
    );

    console.log(retorno);
    carregarProdutos();
    limparProduto();
}

// Atualizar produto
async function atualizarProduto() {
    const codproduto = ModalCodproduto.value;
    const nome = ModalNome.value;
    const precoVenda = ModalPrecoVenda.value;
    const precoCusto = ModalPrecoCusto.value;
    const estoque = ModalEstoque.value;
    const tipo = ModalTipo.value;
    const ativoInativo = ModalAtivoInativo.value;

    const retorno = await window.api.atualizarProduto(
        codproduto, nome, precoVenda, precoCusto, estoque, tipo, ativoInativo
    );

    console.log(retorno);
    carregarProdutos();
    limparProduto();
}

// Excluir produto
async function excluirProduto() {
    const codproduto = ModalCodproduto.value;
    if (!codproduto) return;

    const resultado = await window.api.deletarProduto(codproduto);
    console.log(resultado);

    carregarProdutos();
    limparProduto();
}

// Criar linhas da tabela
function criarLinhaProduto(produto) {
    const linha = document.createElement("tr");

    const celulas = [
        produto.codproduto,
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
            produto.codproduto,
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
