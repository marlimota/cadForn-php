// window.onload = function () {
//   history.replaceState("", "", "/");
// }//para não registrar um novo fornecedor -cópia do anterior - a cada vez que a página for atualizada



// let providersList = []; // array que recebe a lista de fornecedores - todo novo fornecedor é adicionado a lista

//document.getElementById("pageOverlay") //seleciona um elemento do html
let pageOverlay = document.getElementById("pageOverlay"); //salva o elemento do html em uma variável

let providersTable = document.getElementById("providersTable"); //onde a tabela vai ser desenhada no html


var xmlhttpSearch;//variavel criada para a busca(armazena a request de busca) - usada globalmente para ser abortada 

let itemsByPage = 5;
let pageNumber = 0;
let numberOfPages = 1;

//instância do objeto Provider que fica fixa na página principal
// let defaultProvider = new Provider(
//   "Marli",
//   "Mota",
//   "00.000.000/0000-00",
//   "(00)0000-0000",
//   "(00)00000-0000",
//   "Rua das ruas, 99 - São paulo SP",
//   "marli@mota.com",
//   "www.marli.com.br",
//   "Softwares",
//   "000000.0000-01"
// );

//providersList.push(defaultProvider);
GetResponsibleList();
ReadAll();//atualiza a página assim que é aberta pela primeira vez

//função que mostra/esconde a tela de Overlay
function SetPageOverlayVisibility(visible) {
  pageOverlay.style.display = visible ? "block" : "none";

  if (!visible) {
    //reseta os valores inseridos anteriormente
    document.getElementById('nomeFantasia').value = "";
    document.getElementById('razaoSocial').value = "";
    document.getElementById('cnpj').value = "";
    document.getElementById('telefone').value = "";
    document.getElementById('celular').value = "";
    document.getElementById('endereco').value = "";
    document.getElementById('email').value = "";
    document.getElementById('site').value = "";
    document.getElementById('produto').value = "";
    document.getElementById('contrato').value = "";
    document.getElementById('inicioDoContrato').value = "";
    document.getElementById('fimDoContrato').value = "";
    document.getElementById('responsavel').value = "";
    document.getElementById('observacao').value = "";
    document.getElementById('addProviderButtonBox').style.display = "none";
    document.getElementById('detailsButtonBox').style.display = "none";
    document.getElementById('editButtonBox').style.display = "none";
    SetReadOnly(false);
  }
}

//mosta/esconde os botões e toda a tela de adicionar  
function SetNewProviderScreenVisibility(visible) {
  SetPageOverlayVisibility(visible);
  addProviderButtonBox.style.display = visible ? "flex" : "none";
}

//construtor do objeto Provider - contém todos os atributos que o fornecedor deve ter e o método que verifica se é válido
function Provider(nomeFantasia, razaoSocial, cnpj, telefone, celular, endereco, email, site, produto, contrato, inicioDoContrato, fimDoContrato, responsavel, observacao = "") {
  this.nomeFantasia = nomeFantasia;
  this.razaoSocial = razaoSocial;
  this.cnpj = cnpj;
  this.telefone = telefone;
  this.celular = celular;
  this.endereco = endereco;
  this.email = email;
  this.site = site;
  this.produto = produto;
  this.contrato = contrato;
  this.inicioDoContrato = inicioDoContrato;
  this.fimDoContrato = fimDoContrato;
  this.responsavel = responsavel;
  this.observacao = observacao;
  this.IsArchived = 0;
  this.ID = 0;

  //função para validação dos campos do formulário
  this.IsValid = function () {

    if (this.nomeFantasia.length < 3 || this.nomeFantasia.length > 255) {
      alert("O nome deve ter pelo menos 3 caracteres!");
      return false;
    }
    if (this.razaoSocial.length < 3 || this.razaoSocial.length > 255) {
      alert("A razão social deve ter pelo menos 3 caracteres!");
      return false;
    }

    if (this.cnpj.length < 14) {
      alert("O CNPJ deve ter pelo menos 14 caracteres!");
      return false;
    }

    if (this.endereco.length < 20 || this.endereco.length > 255) {
      alert("O endereço deve ter pelo menos 20 caracteres!");
      return false;
    }

    if (this.telefone === "") {
      alert("Você deve digitar um telefone válido!");
      return false;
    }

    if (this.celular === "") {
      alert("Você deve digitar um celular válido!");
      return false;
    }

    //regex: lógica para padrões
    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+/;
    if (!regex.test(this.email)) {
      alert("Você deve digitar um e-mail válido!");
      return false;
    }

    if (this.produto === "") {
      alert("Você deve digitar um produto!");
      return false;
    }

    if (this.inicioDoContrato >= this.fimDoContrato) {
      alert("O inicio do contrato deve acontecer antes do fim do contrato!");
      return false;
    }

    if (this.contrato.length < "") {
      alert("Você deve digitar o número do contrato completo!");
      return false;
    }

    if (this.responsavel === "") {
      alert("Você deve escolher um responsavel!");
      return false;
    }

    if (this.observacao.length > 255) {
      alert("Você excedeu o limite de 255 caracteres no campo observação!");
      return false;
    }
    return true;
  }
}

//função que salva e exibe na tela o novo fornecedor
function SaveNewProvider() {
  SetReadOnly(false);

  let currentProvider = new Provider(
    document.getElementById("nomeFantasia").value,
    document.getElementById('razaoSocial').value,
    document.getElementById('cnpj').value,
    document.getElementById('telefone').value,
    document.getElementById('celular').value,
    document.getElementById('endereco').value,
    document.getElementById('email').value,
    document.getElementById('site').value,
    document.getElementById('produto').value,
    document.getElementById('contrato').value,
    document.getElementById('inicioDoContrato').value,
    document.getElementById('fimDoContrato').value,
    document.getElementById('responsavel').value,
    document.getElementById('observacao').value,
  );

  if (currentProvider.IsValid()) {
    //Se o fornecedor for válido, a action do formulário se torna criar e o metodo muda para Post - depois submit
    // providersForm.action = "/criar";
    // providersForm.method = "POST";
    // providersForm.submit();
    let xmlhttp = new XMLHttpRequest();//variavel local, que armazena um objeto que possui propriedades e funções 
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {//verifica se está tudo certo com a requisição
        Search(document.getElementById("searchbox").value);//atualiza a lista na tela
        SetPageOverlayVisibility(false);
      }
    }

    xmlhttp.open('POST', '/criar', true);//abre uma solicitação do tipo post, no /criar, de forma assincrona
    xmlhttp.setRequestHeader("Accept", "application/json");
    //    xmlhttp.setRequestHeader('x-csrf-token', getCSRFToken());
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    xmlhttp.send(JSON.stringify(currentProvider));//envia a informação do tipo Json, mas em forma de texto
  }
}

//função excluir
function DeleteProvider(providerID) {
  if (window.confirm("Atenção! Isso vai excluir todos os dados do fornecedor. Deseja continuar?")) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        Search(document.getElementById("searchbox").value);//atualiza a pagina
      }
    }

    xmlhttp.open('POST', '/deletar', true);

    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xmlhttp.send('id=' + providerID);
  }

}

//função detalhes 
function ShowProviderDetails(providerID) {
  SetReadOnly(true);//bloqueia a edição dos dados
  document.getElementById("detailsButtonBox").style.display = "flex";//exibe os botões relacionados 
  FillOverlay(providerID);
}

//função editar
function EditProvider(providerID) {
  FillOverlay(providerID);
  SetReadOnly(false);

  document.getElementById("editButtonBox").style.display = "flex";//exibe os botões relacionados
  //configura o botão de confirmar edição para salvar os novos dados 
  document.getElementById("edit-confirm-btn").setAttribute("onClick", "javascript: SaveEditedProvider(" + providerID + ");");
}

//preenche os campos do overlay com os dados do fornecedor escolhido
function FillOverlay(providerID) {

  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("providersForm").innerHTML = this.responseText;
      selectedProvider = JSON.parse(this.responseText);//converte o texto que o servidor retornou para Json

      document.getElementById("nomeFantasia").value = selectedProvider.nomeFantasia;
      document.getElementById('razaoSocial').value = selectedProvider.razaoSocial;
      document.getElementById('cnpj').value = selectedProvider.cnpj;
      document.getElementById('telefone').value = selectedProvider.telefone;
      document.getElementById('celular').value = selectedProvider.celular;
      document.getElementById('endereco').value = selectedProvider.endereco;
      document.getElementById('email').value = selectedProvider.email;
      document.getElementById('site').value = selectedProvider.site;
      document.getElementById('produto').value = selectedProvider.produto;
      document.getElementById('contrato').value = selectedProvider.contrato;
      document.getElementById('inicioDoContrato').value = selectedProvider.inicioDoContrato;
      document.getElementById('fimDoContrato').value = selectedProvider.fimDoContrato;
      document.getElementById('responsavel').value = selectedProvider.responsavel;
      document.getElementById('observacao').value = selectedProvider.observacao;

      SetPageOverlayVisibility(true);
    }
  }
  xmlhttp.open("GET", "/ler/" + providerID, true);
  xmlhttp.send();

}


function SaveEditedProvider(providerID) {
  //Cria um objeto fornecedor com todas as informações contidas nos campos de edição
  let provider = new Provider(
    document.getElementById('nomeFantasia').value,
    document.getElementById('razaoSocial').value,
    document.getElementById('cnpj').value,
    document.getElementById('telefone').value,
    document.getElementById('celular').value,
    document.getElementById('endereco').value,
    document.getElementById('email').value,
    document.getElementById('site').value,
    document.getElementById('produto').value,
    document.getElementById('contrato').value,
    document.getElementById('inicioDoContrato').value,
    document.getElementById('fimDoContrato').value,
    document.getElementById('responsavel').value,
    document.getElementById('observacao').value
  );

  provider.ID = providerID;

  //Caso todas as informações sejam válidas atualiza a lista de fornecedores e esconde os campos de edição
  if (provider.IsValid()) {

    if (!window.confirm("Atenção! Isso pode alterar os dados do fornecedor. Deseja continuar?")) {
      return;
    }

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        Search(document.getElementById("searchbox").value);
        SetPageOverlayVisibility(false);
      }
    }

    xmlhttp.open('POST', '/atualizar', true);
    xmlhttp.setRequestHeader("Accept", "application/json");
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlhttp.send(JSON.stringify(provider));
  }
};

//função para mudança de páginas
function ChangePage(changeBy) {
  if (pageNumber + changeBy >= 0
    && pageNumber + changeBy < numberOfPages) {
    pageNumber += changeBy;
    Search(document.getElementById("searchbox").value);
  }
}

//função editar campos (para tornar detalhes ineditável)
SetReadOnly = function (value) {
  document.getElementById("nomeFantasia").readOnly = value;
  document.getElementById("razaoSocial").readOnly = value;
  document.getElementById("cnpj").readOnly = value;
  document.getElementById("telefone").readOnly = value;
  document.getElementById("celular").readOnly = value;
  document.getElementById("endereco").readOnly = value;
  document.getElementById("email").readOnly = value;
  document.getElementById("site").readOnly = value;
  document.getElementById("produto").readOnly = value;
  document.getElementById("contrato").readOnly = value;
  document.getElementById('inicioDoContrato').readOnly = value;
  document.getElementById('fimDoContrato').readOnly = value;
  document.getElementById('responsavel').readOnly = value;
  document.getElementById("observacao").readOnly = value;
}

//função imprimir detalhes
function Print() {
  //para botões não aparecerem na impressão
  document.getElementById("detailsButtonBox").style.display = "none";
  window.print();
  document.getElementById("detailsButtonBox").style.display = "flex";
}

//mascara jquery para preenchimento do formulario
$(document).ready(function () {
  $("#cnpj").mask("99.999.999/9999-99");
});

$(document).ready(function () {
  $("#telefone").mask("(99)9999-9999");
});

$(document).ready(function () {
  $("#celular").mask("(99)99999-9999");
});

$(document).ready(function () {
  $("#contrato").mask("999999.9999-99");
});

//função que preenche a tabela

function ReadAll(providersList = null) {

  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (providersList == null) {
        providersList = JSON.parse(this.responseText);
      }

      data = ""; //variavel que armeza o código html gerado no js e que no futuro será enviado para dentro do elemento providersTable

      //contador de páginas
      numberOfPages = Math.ceil(providersList.length / itemsByPage);

      numberOfPages = numberOfPages > 0 ? numberOfPages : 1;

      if (pageNumber >= numberOfPages) {
        return ChangePage(-1);
      }

      document.getElementById("numberPage").innerHTML = ("página " + (pageNumber + 1) + " de " + numberOfPages);

      //se tiver pelo menos um fornecedor
      if (providersList.length > 0) {
        //executa de acordo com a quantidade de fornecedores por página
        for (i = 0; i < itemsByPage; i++) {
          //interrompe a função assim que todos os fornecedores da página atual forem adicionados a tabela, mesmo que não tenha atingido o máximo de  fornecedores por páginas
          if (providersList.length <= pageNumber * itemsByPage + i) {
            return document.getElementById("providersTable").innerHTML = data;
          }
          //construção da tabela html
          data += '<tr>';
          data += '<td>' + providersList[pageNumber * itemsByPage + i].nomeFantasia + '</td>';
          data += '<td>' + providersList[pageNumber * itemsByPage + i].razaoSocial + '</td>';
          data += '<td>' + providersList[pageNumber * itemsByPage + i].cnpj + '</td>';
          data += '<td>' + providersList[pageNumber * itemsByPage + i].telefone + '</td>';
          data += '<td>' + providersList[pageNumber * itemsByPage + i].celular + '</td>';
          data += '<td> <div class = "btn-action-container"> <Button onclick="ShowProviderDetails(' + providersList[pageNumber * itemsByPage + i].id + ')" type="button" class="btn-action" id="details-btn"><i class="fa fa-eye"></i></Button>';
          data += '<Button onclick="EditProvider (' + providersList[pageNumber * itemsByPage + i].id + ')"  class="btn-action" id="edit-btn"><i class="fa fa-edit"></i></Button>';
          data += '<button onclick="DeleteProvider(' + providersList[pageNumber * itemsByPage + i].id + ')" type="button" class="btn-action"><i class="fa fa-trash"></i></button></div> </td>';
          data += '</tr>';
        }
      }
      return document.getElementById("providersTable").innerHTML = data;
    }
  }

  xmlhttp.open("GET", "/lertodos", true);
  xmlhttp.send();
}

function Search(textToSearch) {
  if (textToSearch == "") {
    return ReadAll();
  }

  if (xmlhttpSearch) {
    xmlhttpSearch.abort();
  }
  else {
    xmlhttpSearch = new XMLHttpRequest();
  }

  xmlhttpSearch.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      return ReadAll(JSON.parse(this.responseText));
    }
  }

  xmlhttpSearch.open("POST", "/buscar", true);
  xmlhttpSearch.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  if (textToSearch != "") {
    xmlhttpSearch.send("textToSearch=" + textToSearch);
  }
}

function GetResponsibleList() {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      select = document.getElementById("responsavel");
      options = JSON.parse(this.responseText);

      for (var i = 0; i < options.length; i++) {
        var opt = document.createElement('option');
        opt.value = options[i].id;
        opt.innerHTML = options[i].nome_responsavel;
        select.appendChild(opt);
      }
    }
  }

  xmlhttp.open("GET", "/lerresponsaveis", true);
  xmlhttp.send();
}

function Logout() {
  let xmlhttp = new XMLHttpRequest();//formulário de requisição
  xmlhttp.onreadystatechange = function () {//acontece quando o status da requisição muda
    if (this.readyState == 4 && this.status == 200) {//verifica se o status da requisição é concluído e aprovado
      alert("Usuário desconectado com sucesso!");
      window.location.pathname = "/";
    }
  }
  xmlhttp.open("POST", "/sair", true);//preenche o formulário de requisição(escolhe o tipo de formulário)
  //xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlhttp.send();//entrega do formulário de requisição
}

