document.addEventListener('DOMContentLoaded', function() {
    // Carrega as funções ao carregar a página
    carregarFuncoes();
    
    // Configura o formulário
    const form = document.getElementById('funcionario-form');
    if (form) {
        form.addEventListener('submit', cadastrarFuncionario);
    }
    
    // Formatação do CPF
    const campoCpf = document.getElementById("cpf");
    if (campoCpf) {
        campoCpf.addEventListener("keypress", () => {    
            let tamanhoCampo = campoCpf.value.length;
            if(tamanhoCampo == 3 || tamanhoCampo == 7){
                campoCpf.value += ".";
            }else if(tamanhoCampo == 11){
                campoCpf.value += "-";
            }
        });
    }

    // Formatação do RG
    const campoRg= document.getElementById("rg");
    if (campoRg) {
        campoRg.addEventListener("keypress", () => {    
            let tamanhoCampo = campoRg.value.length;
            if(tamanhoCampo == 2 || tamanhoCampo == 6){
                campoRg.value += ".";
            }else if(tamanhoCampo == 10){
                campoRg.value += "-";
            }
        });
    }
});

// Função para carregar as funções no dropdown
async function carregarFuncoes() {
    try {
        const response = await fetch('/funcao');
        const funcoes = await response.json();
        
        const selectFuncao = document.getElementById('funcao');
        selectFuncao.innerHTML = '<option value="">Selecione a função</option>';
        
        funcoes.forEach(funcao => {
            const option = document.createElement('option');
            option.value = funcao.id;
            option.textContent = funcao.nomefun;
            selectFuncao.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar funções:', error);
    }
}

async function cadastrarFuncionario(event) {

    event.preventDefault();

    let nome_funcionario = document.getElementById("nome").value;

    const funcionario = {
        nome: nome_funcionario,
        cpf: document.getElementById("cpf").value,
        rg: document.getElementById("rg").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        data_nascimento: document.getElementById("data_nascimento").value,
        data_contratacao: document.getElementById("data_contratacao").value,
        endereco: document.getElementById("endereco").value,
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

        if (response.ok) {
            const result = await response.json();
            alert("Funcionário cadastrado com sucesso!");
            document.getElementById("funcionario-form").reset();
            // Recarrega as funções no dropdown após cadastro
            carregarFuncoes();
        } else {
            const result = await response.json();
            alert(`Erro: ${result.message || 'Erro desconhecido'}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar funcionário. Verifique se todos os campos estão preenchidos corretamente.");
    }
}

// Função para listar todos os Funcionários
async function listarFuncionario() {
    const cpf = document.getElementById('cpf').value.trim();
    let url = '/funcionarios';

    if (cpf) {
        url += `?cpf=${cpf}`;
    }

    try {
        const response = await fetch(url);
        const funcionarios = await response.json();

        const tabela = document.getElementById('tabela-funcionarios');
        tabela.innerHTML = '';

        if (funcionarios.length === 0) {
            tabela.innerHTML = '<tr><td colspan="6">Nenhum funcionário encontrado.</td></tr>';
        } else {
            funcionarios.forEach(funcionario => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${funcionario.id}</td>
                    <td>${funcionario.nome}</td>
                    <td>${funcionario.cpf}</td>
                    <td>${funcionario.email}</td>
                    <td>${funcionario.telefone}</td>
                    <td>${funcionario.funcao_nome || 'N/A'}</td>
                `;
                linha.addEventListener('click', () => {
                    document.getElementById('id').value = funcionario.id;
                    document.getElementById('nome').value = funcionario.nome;
                    document.getElementById('cpf').value = funcionario.cpf;
                    document.getElementById('rg').value = funcionario.rg;
                    document.getElementById('telefone').value = funcionario.telefone;
                    document.getElementById('email').value = funcionario.email;
                    document.getElementById('data_nascimento').value = funcionario.data_nascimento;
                    document.getElementById('data_contratacao').value = funcionario.data_contratacao;
                    document.getElementById('endereco').value = funcionario.endereco;
                    document.getElementById('funcao').value = funcionario.funcao_id;
                });
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar funcionários:', error);
        alert('Erro ao carregar funcionários.');
    }
}

// Função para atualizar as informações do funcionário
async function atualizarFuncionario() {
    const id = document.getElementById('id').value;
    
    if (!id) {
        alert('Selecione um funcionário para atualizar.');
        return;
    }

    const funcionarioAtualizado = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        rg: document.getElementById('rg').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        data_nascimento: document.getElementById('data_nascimento').value,
        data_contratacao: document.getElementById('data_contratacao').value,
        endereco: document.getElementById('endereco').value,
        funcao_id: document.getElementById('funcao').value
    };

    try {
        const response = await fetch(`/funcionarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionarioAtualizado)
        });

        if (response.ok) {
            alert('Funcionário atualizado com sucesso!');
            limpaFuncionario();
            listarFuncionario();
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar funcionário: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        alert('Erro ao atualizar funcionário.');
    }
}

function limpaFuncionario() {
    document.getElementById('funcionario-form').reset();
    const idField = document.getElementById('id');
    if (idField) {
        idField.value = '';
    }
}
