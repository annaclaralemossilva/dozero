document.addEventListener('DOMContentLoaded', function() {

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
});


// Função para buscar o relatório com filtros
function buscarRelatorio() {
    const cpf = document.getElementById("cpf").value;
    const produto = document.getElementById("produto").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;

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
    
    // Construir a URL com os parâmetros de filtro
    let url = `/relatorios?`;
    if (cpf) url += `cpf=${cpf}&`;
    if (produto) url += `produto=${produto}&`;
    if (dataInicio) url += `dataInicio=${dataInicio}&`;
    if (dataFim) url += `dataFim=${dataFim}&`;

    // Remover o último "&" se presente
    url = url.slice(0, -1);

    // Fazer a requisição para o servidor
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Limpar a tabela
            const tabelaVendas = document.getElementById("tabela-vendas");
            tabelaVendas.innerHTML = '';

            // Preencher a tabela com os dados
            data.forEach(venda => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${venda.id}</td>
                    <td>${venda.cliente_nome}</td>
                    <td>${venda.produto_nome}</td>
                    <td>${venda.quantidade}</td>
                    <td>${new Date(venda.data).toLocaleString()}</td>
                `;
                tabelaVendas.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar relatórios:', error);
        });
}
