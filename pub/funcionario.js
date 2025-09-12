document.addEventListener('DOMContentLoaded', function() {

    // Configura o formulário
    const form = document.getElementById('funcionario-form');
    if (form) {
        form.addEventListener('submit', cadastrarFuncionario);
    }

    // Carrega as funções disponíveis
    carregarFuncoes();

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

async function cadastrarFuncionario(event){
    event.preventDefault();

    let nome_funcionario = document.getElementById('nome').value;

    const funcionario = {
        nome: nome_funcionario,
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
        const response = await fetch('/funcionarios',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionario)
        });

        const result = await response.json();
        
        if (response.ok) {
            alert('Funcionario cadastrado com sucesso!');
            document.getElementById("funcionario-form").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar funcionario.");
    }
}
//Função para listar os funcionarios
async function listarFuncionario() {
    const cpf = document.getElementById('cpf').value.trim();

    let url = '/buscar-funcionarios';

    if (cpf){
        url += `?cpf=${cpf}`;
    }

    try {
        const response = await fetch(url);
        const funcionarios = await response.json();

        const tabela = document.getElementById('tabela-funcionarios');
        tabela.innerHTML = '';

        if (funcionarios.length === 0){
            tabela.innerHTML = '<tr><td colspan="6">Nenhum funcionario encontrado.</td></tr>';
        } else {
            funcionarios.forEach (funcionario => {
                const linha = document.createElement('tr');
                linha.style.cursor = 'pointer';
                linha.onclick = () => selecionarFuncionario(funcionario.nome, funcionario.cpf, funcionario.rg, funcionario.telefone, funcionario.email, funcionario.data_nascimento, funcionario.data_contratacao, funcionario.endereco, funcionario.funcao_id);
                linha.innerHTML = `
                    <td>${funcionario.id}</td>
                    <td>${funcionario.nome}</td>
                    <td>${funcionario.cpf}</td>  
                    <td>${funcionario.email}</td>
                    <td>${funcionario.telefone}</td>
                    <td>${funcionario.funcao || 'Sem função'}</td>
                `;
                tabela.appendChild(linha); 
            });
        }
    } catch (error) {
        console.error('Erro ao listar funcionário:', error);
    }
}
//Função para atualização um funcionario
async function atualizarFuncionarios() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const rg = document.getElementById('rg').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const data_nascimento = document.getElementById('data_nascimento').value;
    const data_contratacao = document.getElementById('data_contratacao').value;
    const endereco = document.getElementById('endereco').value;
    const funcao_id = document.getElementById('funcao').value;

    const funcionarioAtualizado = {
        nome,
        rg,
        telefone,
        email,
        data_nascimento,
        data_contratacao,
        endereco,
        funcao_id: funcao_id
    };

    try {
        const response = await fetch(`/funcionarios/cpf/${cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionarioAtualizado)
        });

        if (response.ok) {
            alert('Funcionário atualizado com sucesso!');
            limpaFuncionario();
            listarFuncionario(); // Recarrega a lista após atualizar
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar funcionario: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        alert('Erro ao atualizar funcionário.');
    }
}

async function limpaFuncionario() {
    document.getElementById('nome').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('rg').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('data_nascimento').value = '';
    document.getElementById('data_contratacao').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('funcao').value = '';
}

//função para selecionar um funcionario
function selecionarFuncionario(nome, cpf, rg, telefone, email, data_nascimento, data_contratacao, endereco, funcao_id) {
    document.getElementById('nome').value = nome;
    document.getElementById('cpf').value = cpf;
    document.getElementById('rg').value = rg;
    document.getElementById('telefone').value = telefone;
    document.getElementById('email').value = email;
    document.getElementById('data_nascimento').value = data_nascimento;
    document.getElementById('data_contratacao').value = data_contratacao;
    document.getElementById('endereco').value = endereco;
    document.getElementById('funcao').value = funcao_id;

    // desativa
    document.getElementById("cpf").disabled = true;
    document.getElementById("rg").disabled = true;
    document.getElementById("data_nascimento").disabled = true;
}

// Função para carregar as funções disponíveis
async function carregarFuncoes() {
    try {
        const response = await fetch('/buscar-funcoes');
        const funcoes = await response.json();
        
        const selectFuncao = document.getElementById('funcao');
        
        // Limpa o select (mantém apenas a opção padrão)
        selectFuncao.innerHTML = '<option value="">Selecione a função</option>';
        
        // Adiciona cada função como uma opção
        funcoes.forEach(funcao => {
            const option = document.createElement('option');
            option.value = funcao.id;
            option.textContent = funcao.nomefun;
            selectFuncao.appendChild(option);
        });
        
    } catch (error) {
        console.error('Erro ao carregar funções:', error);
        alert('Erro ao carregar as funções disponíveis.');
    }
}

    