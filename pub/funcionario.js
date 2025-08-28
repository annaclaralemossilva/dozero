let campoCpf = document.querySelector(".cpf")

campoCpf.addEventListener("keypress", ()=>{    
    let tamanhoCampo = campoCpf.value.length
    if(tamanhoCampo == 3 || tamanhoCampo == 7){
        campoCpf.value += "."
    }else if(tamanhoCampo == 11){
        campoCpf.value += "-"
    }

})


async function cadastrarFuncionario(event) {
    event.preventDefault();

    let nome_funcio = document.getElementById("nome").value;

    const funcionario = {
        nome: nome_funcio,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        cpf: document.getElementById("cpf").value,
        rg: document.getElementById("rg").value,
        endereco: document.getElementById("endereco").value,
        data_nascimento: document.getElementById("data_nascimento").value,
        data_contratacao: document.getElementById("data_contratacao").value,
        funcao_id: document.getElementById("funcao").value
    };

    try {
        const response = await fetch('/funcionarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionario)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Funcionário cadastrado com sucesso!");
            document.getElementById("funci-form").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar cliente.");
    }
}
// Função para listar todos os Funcionários ou buscar clientes por CPF
async function listarFuncionario() {
    const cpf = document.getElementById('cpf').value.trim();  // Pega o valor do CPF digitado no input

    let url = '/funcionarios';  // URL padrão para todos os clientes

    if (cpf) {
        // Se CPF foi digitado, adiciona o parâmetro de consulta
        url += `?cpf=${cpf}`;
    }

    try {
        const response = await fetch(url);
        const funcionarios = await response.json();

        const tabela = document.getElementById('tabela-funcionarios');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (clientes.length === 0) {
            // Caso não encontre funcionarios, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="6">Nenhum funcionário encontrado.</td></tr>';
        } else {
            clientes.forEach(funcionario => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${funcionario.id}</td>
                    <td>${funcionario.nome}</td>
                    <td>${funcionario.cpf}</td>
                    <td>${funcionario.email}</td>
                    <td>${funcionario.telefone}</td>
                    <td>${funcionario.endereco}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar funcionarios:', error);
    }
}
// Função para atualizar as informações do cliente
async function atualizarFuncionario() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;

    const clienteAtualizado = {
        nome,
        email,
        telefone,
        endereco,
        cpf
    };

    try {
        const response = await fetch(`/clientes/cpf/${cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteAtualizado)
        });

        if (response.ok) {
            alert('Cliente atualizado com sucesso!');
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar cliente: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        alert('Erro ao atualizar cliente.');
    }
}


async function limpaCliente() {
    document.getElementById('nome').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('endereco').value = '';

}
