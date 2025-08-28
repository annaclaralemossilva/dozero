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

//Carrega os fornecedores ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    buscarFornecedores();
});
