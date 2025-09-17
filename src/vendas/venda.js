// venda.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos do DOM
    const listaProdutoCarinho = document.getElementById('lista-produtos');
    const carrinhoEl = document.getElementById('carrinho');
    const totalVendaEl = document.getElementById('total');
    const metodoPagamentoEl = document.getElementById('metodo-pagamento');
    const finalizarVendaBtn = document.getElementById('finalizar-venda-btn');
    const voltarBtn = document.getElementById('voltar-btn');
    const searchInput = document.getElementById('search-produtos');

    // 2. Estado
    let produtos = []; // lista completa vinda do DB
    let carrinho = [];

    // ------------------------
    // Utils
    // ------------------------
    // Normaliza string (remove acentos + lowercase)
    function normalizeString(str) {
        if (!str) return '';
        return str.toString()
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '');
    }

    // Converte valores vindo do tipo money do PG para número
    function parseMoney(valor) {
        if (valor == null) return 0;
        let s = String(valor).trim();

        // Remove tudo que não seja dígito, ponto, vírgula ou sinal de menos
        s = s.replace(/[^\d.,-]/g, '');

        // Se tiver ponto e vírgula: ex "1.234,56" -> '.' são milhares, ',' decimal
        if (s.indexOf('.') !== -1 && s.indexOf(',') !== -1) {
            s = s.replace(/\./g, ''); // remove separador de milhares
            s = s.replace(',', '.');  // transforma decimal em dot
        } else {
            // se só tiver vírgula, transforma em dot: "8,50" -> "8.50"
            if (s.indexOf(',') !== -1) {
                s = s.replace(',', '.');
            }
            // se tem só ponto, é provavelmente decimal já (ou 1000.50)
        }

        const num = parseFloat(s);
        return isNaN(num) ? 0 : num;
    }

    // ------------------------
    // Renderização
    // ------------------------
    function renderProdutos(lista) {
        listaProdutoCarinho.innerHTML = '';

        if (!lista || lista.length === 0) {
            listaProdutoCarinho.textContent = 'Nenhum produto encontrado.';
            return;
        }

        lista.forEach(criarProdutoUI);
    }

    // Cria card de produto
    function criarProdutoUI(produto) {
        const div = document.createElement('div');
        div.classList.add('produto-card');

        const precoVenda = parseMoney(produto.preco_venda);
        const precoCusto = parseMoney(produto.preco_custo);

        div.innerHTML = `
            <h3>${produto.nome}</h3>
            <p>Preço: R$ ${precoVenda.toFixed(2)}</p>
            <p>Estoque: ${produto.estoque}</p>
            <button class="btn-add">Adicionar</button>
        `;

        div.querySelector('.btn-add').addEventListener('click', () => {
            adicionarAoCarrinho({
                ...produto,
                preco_venda: precoVenda,
                preco_custo: precoCusto
            });
        });

        listaProdutoCarinho.appendChild(div);
    }

    // ------------------------
    // Busca/Carregamento
    // ------------------------
    async function carregarProdutos() {
        try {
            // busca do main process via preload (window.api)
            produtos = await window.api.buscarProdutosCarinho();
            renderProdutos(produtos);
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
            listaProdutoCarinho.textContent = 'Erro ao carregar produtos.';
        }
    }

    // ------------------------
    // Pesquisa (filtro)
    // ------------------------
    function filtrarProdutosPorTexto(texto) {
        const q = normalizeString(texto);
        if (!q) {
            renderProdutos(produtos);
            return;
        }
        const filtrados = produtos.filter(p => normalizeString(p.nome).includes(q));
        renderProdutos(filtrados);
    }

    searchInput && searchInput.addEventListener('input', (e) => {
        filtrarProdutosPorTexto(e.target.value);
    });

    // ------------------------
    // Carrinho
    // ------------------------
    function adicionarAoCarrinho(produto) {
        const itemExistente = carrinho.find(item => item.id === produto.id);

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.push({ ...produto, quantidade: 1 });
        }
        
        atualizarCarrinhoUI();
    }

    function removerDoCarrinho(produtoId) {
        carrinho = carrinho.filter(item => item.id !== produtoId);
        atualizarCarrinhoUI();
    }

    function atualizarCarrinhoUI() {
        carrinhoEl.innerHTML = '';
        let total = 0;

        if (carrinho.length === 0) {
            carrinhoEl.innerHTML = '<p>O carrinho está vazio.</p>';
        } else {
            carrinho.forEach(item => {
                const itemCarrinhoDiv = document.createElement('div');
                itemCarrinhoDiv.classList.add('item-carrinho');
                itemCarrinhoDiv.innerHTML = `
                    <span>${item.nome} (${item.quantidade}x)</span>
                    <span>R$ ${(item.preco_venda * item.quantidade).toFixed(2)}</span>
                    <button class="remover-item-btn" data-id="${item.id}">Remover</button>
                `;
                carrinhoEl.appendChild(itemCarrinhoDiv);
                total += item.preco_venda * item.quantidade;
            });

            carrinhoEl.querySelectorAll('.remover-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const produtoId = parseInt(e.target.dataset.id, 10);
                    removerDoCarrinho(produtoId);
                });
            });
        }
        
        totalVendaEl.textContent = total.toFixed(2);
    }

    // ------------------------
    // Finalizar venda
    // ------------------------
    async function finalizarVenda() {
        if (carrinho.length === 0) {
            window.api.dialogAlert("O carrinho está vazio. Adicione produtos para finalizar a venda.");
            return;
        }

        const totalVenda = parseFloat(totalVendaEl.textContent);
        const metodoPagamento = metodoPagamentoEl.value;

        const payload = {
            total: totalVenda,
            metodoPagamento,
            itens: carrinho.map(item => ({
                id: item.id,
                nome: item.nome,
                preco: item.preco_venda,
                quantidade: item.quantidade
            }))
        };
        
        const confirmacao = await window.api.dialogConfirm(`Finalizar venda de R$ ${totalVenda.toFixed(2)}?`);
        
        if (confirmacao) {
            try {
                const result = await window.api.finalizarVenda(payload);
                
                if (result.success) {
                    window.api.dialogAlert(result.message);
                    carrinho = [];
                    atualizarCarrinhoUI();
                } else {
                    window.api.dialogAlert(result.message);
                }
            } catch (error) {
                console.error("Erro ao finalizar a venda:", error);
                window.api.dialogAlert("Falha ao finalizar a venda. Tente novamente.");
            }
        }
    }

    // ------------------------
    // Eventos e inicialização
    // ------------------------
    finalizarVendaBtn.addEventListener('click', finalizarVenda);
    voltarBtn.addEventListener('click', () => window.api.abrirJanelaPrincipal());

    // Carrega produtos na inicialização
    carregarProdutos();
});
