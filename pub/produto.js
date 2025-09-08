async function cadastrarProduto(event) {
    event.preventDefault();

    const produto = {
        nome: document.getElementById("nome").value,
        preco: parseFloat(document.getElementById("preco").value),
        quantidade_estoque: parseInt(document.getElementById("quantidade_estoque").value),
        descricao: document.getElementById("descricao").value,
        tipo: document.getElementById("tipo").value,
        fornecedor_id: parseInt(document.getElementById("fornecedor").value)
    };

    try {
        const response = await fetch('/produto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Produto cadastrado com sucesso!");
            document.getElementById("produto-form").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar produto.");
    }
}


// Função para buscar fornecedores
function buscarFornecedores() {
    fetch('/buscar-fornecedores')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar fornecedores');
            }
            return response.json();
        })
        .then(fornecedores => {
            const select = document.getElementById('fornecedor');
            // Limpa as opções existentes
            select.innerHTML = '<option value="">Selecione um fornecedor</option>';
            fornecedores.forEach(fornecedor => {
                const option = document.createElement('option');
                option.value = fornecedor.id; // Usa o id como valor
                option.textContent = fornecedor.nome; // Nome do serviço exibido
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os fornecedores:', error);
        });
}


// Função para listar todos os produto
async function listarProdutos() {
    
    try {
        const response = await fetch('/produto');
        const produtos = await response.json();

        const tabela = document.getElementById('tabela-produtos');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (produtos.length === 0) {
            // Caso não encontre produto, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="4">Nenhum produto encontrado.</td></tr>';
        } else {
            produtos.forEach(produto => {
                const linha = document.createElement('tr');
                linha.style.cursor = 'pointer';
                linha.onclick = () => selecionarProduto(produto.id, produto.nome, produto.preco, produto.quantidade_estoque, produto.descricao, produto.tipo, produto.fornecedor_id);
                linha.innerHTML = `
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>R$ ${produto.preco.toFixed(2)}</td>
                    <td>${produto.quantidade_estoque}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
    }
}

// Função para atualizar produto
async function atualizarProduto() {
    const id = document.getElementById('id').value;
    
    if (!id) {
        alert('Selecione um produto para atualizar (clique em uma linha da tabela).');
        return;
    }

    const produtoAtualizado = {
        nome: document.getElementById('nome').value,
        preco: parseFloat(document.getElementById('preco').value),
        quantidade_estoque: parseInt(document.getElementById('quantidade_estoque').value),
        descricao: document.getElementById('descricao').value,
        tipo: document.getElementById('tipo').value,
        fornecedor_id: parseInt(document.getElementById('fornecedor').value)
    };

    // Validação básica
    if (!produtoAtualizado.nome || !produtoAtualizado.preco || !produtoAtualizado.quantidade_estoque) {
        alert('Nome, preço e quantidade são campos obrigatórios.');
        return;
    }

    try {
        const response = await fetch(`/produto/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produtoAtualizado)
        });

        if (response.ok) {
            alert('Produto atualizado com sucesso!');
            document.getElementById('produto-form').reset();
            listarProdutos(); // Refresh the list
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar produto: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        alert('Erro ao atualizar produto.');
    }
}

// Função para selecionar produto da tabela para edição
function selecionarProduto(id, nome, preco, quantidade, descricao, tipo, fornecedor_id) {
    document.getElementById('id').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('preco').value = preco;
    document.getElementById('quantidade_estoque').value = quantidade;
    document.getElementById('descricao').value = descricao;
    document.getElementById('tipo').value = tipo;
    document.getElementById('fornecedor').value = fornecedor_id;
    
    // Tornar o campo ID visível quando um produto for selecionado
    const idInput = document.getElementById('id');
    if (idInput) {
        idInput.style.display = 'block';
    }
}

// Função para limpar formulário
function limparFormulario() {
    document.getElementById('produto-form').reset();
    document.getElementById('id').value = '';
    
    // Esconder o campo ID novamente
    const idGroup = document.querySelector('#id').parentElement;
    if (idGroup) {
        idGroup.style.display = 'none';
    }
}

//Carrega os fornecedores ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    buscarFornecedores();
});