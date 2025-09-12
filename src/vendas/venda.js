// vendas.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos do DOM
    const listaProdutosEl = document.getElementById('lista-produtos');
    const carrinhoEl = document.getElementById('carrinho');
    const totalVendaEl = document.getElementById('total');
    const metodoPagamentoEl = document.getElementById('metodo-pagamento');
    const finalizarVendaBtn = document.getElementById('finalizar-venda-btn');
    const voltarBtn = document.getElementById('voltar-btn');

    // 2. Variáveis de estado
    let produtos = []; // Array para armazenar os produtos do banco de dados
    let carrinho = []; // Array para armazenar os itens da venda atual

    // 3. Funções da lógica de vendas

    // Função para carregar e exibir os produtos na interface
    async function carregarProdutos() {
        try {
            // Usa a função do preload para buscar os produtos no processo principal
            produtos = await window.api.buscarProdutos();
            
            // Limpa a lista antes de preencher
            listaProdutosEl.innerHTML = '';
            
            // Cria um elemento para cada produto
            produtos.forEach(prod => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item-produto');
                itemDiv.dataset.id = prod.id;
                itemDiv.innerHTML = `${prod.nome} - R$ ${prod.preco_venda.toFixed(2)}`;
                
                // Adiciona um evento de clique para adicionar o produto ao carrinho
                itemDiv.addEventListener('click', () => {
                    adicionarAoCarrinho(prod);
                });
                
                listaProdutosEl.appendChild(itemDiv);
            });

        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            window.api.dialogAlert("Erro ao carregar os produtos. Tente novamente.");
        }
    }

    // Função para adicionar um produto ao carrinho
    function adicionarAoCarrinho(produto) {
        const itemExistente = carrinho.find(item => item.id === produto.id);

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.push({ ...produto, quantidade: 1 });
        }
        
        atualizarCarrinhoUI();
    }

    // Função para remover um item do carrinho
    function removerDoCarrinho(produtoId) {
        carrinho = carrinho.filter(item => item.id !== produtoId);
        atualizarCarrinhoUI();
    }
    
    // Função para atualizar a interface do carrinho e o total
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

            // Adiciona evento de clique para os botões de remover
            carrinhoEl.querySelectorAll('.remover-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const produtoId = parseInt(e.target.dataset.id);
                    removerDoCarrinho(produtoId);
                });
            });
        }
        
        totalVendaEl.textContent = total.toFixed(2);
    }

    // Função para finalizar a venda
    async function finalizarVenda() {
        if (carrinho.length === 0) {
            window.api.dialogAlert("O carrinho está vazio. Adicione produtos para finalizar a venda.");
            return;
        }

        const totalVenda = parseFloat(totalVendaEl.textContent);
        const metodoPagamento = metodoPagamentoEl.value;

        const payload = {
            total: totalVenda,
            metodoPagamento: metodoPagamento,
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
                // Envia a venda para o processo principal através do IPC
                const result = await window.api.finalizarVenda(payload);
                
                if (result.success) {
                    window.api.dialogAlert(result.message);
                    // Limpa o carrinho e a UI após a venda
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

    // 4. Listeners de eventos
    finalizarVendaBtn.addEventListener('click', finalizarVenda);
    voltarBtn.addEventListener('click', () => {
        window.api.abrirJanelaPrincipal(); // Abre a janela principal (menu)
    });

    // 5. Inicialização
    carregarProdutos(); // Carrega os produtos quando a página é aberta
});