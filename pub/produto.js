let campoCnpj = document.querySelector(".cnpj")

campoCnpj.addEventListener("keypress", ()=>{    
    let tamanhoCampo = campoCnpj.value.length
    if(tamanhoCampo == 3 || tamanhoCampo == 7){
        campoCnpj.value += "."
    }else if(tamanhoCampo == 11){
        campoCnpj.value += "-"
    }

})


async function cadastrarProduto(event) {
    event.preventDefault();

    let nome_produto = document.getElementById("nome").value;

    const produto = {
        nome: nome_produto,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        cnpj: document.getElementById("cnpj").value,
        endereco: document.getElementById("endereco").value
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
            alert("produto cadastrado com sucesso!");
            document.getElementById("produtor-form").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar produto.");
    }
}
// Função para listar todos os produto ou buscar produto por CNPJ
async function listarproduto() {
    const cnpj = document.getElementById('cnpj').value.trim();  // Pega o valor do CNPJ digitado no input

    let url = '/produto';  // URL padrão para todos os produto

    if (cnpj) {
        // Se CNPJ foi digitado, adiciona o parâmetro de consulta
        url += `?cnpj=${cnpj}`;
    }

    try {
        const response = await fetch(url);
        const produtor = await response.json();

        const tabela = document.getElementById('tabela-produto');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (produto.length === 0) {
            // Caso não encontre produto, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="6">Nenhum produto encontrado.</td></tr>';
        } else {
            produto.forEach(produto => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.cnpj}</td>
                    <td>${produto.email}</td>
                    <td>${produto.telefone}</td>
                    <td>${produto.endereco}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar produto:', error);
    }
}
// Função para atualizar as informações do produto
async function atualizarProduto() {
    const nome = document.getElementById('nome').value;
    const cnpj = document.getElementById('cnpj').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;

    const produtoAtualizado = {
        nome,
        email,
        telefone,
        endereco,
        cnpj
    };

    try {
        const response = await fetch(`/produto/cnpj/${cnpj}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produtoAtualizado)
        });

        if (response.ok) {
            alert('produto atualizado com sucesso!');
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar produto: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        alert('Erro ao atualizar produto.');
    }
}


async function limpaProduto() {
    document.getElementById('nome').value = '';
    document.getElementById('cnpj').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('endereco').value = '';

}
