<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CadForn - Cadastro</title>
  <!--seo-->
  <meta property="og:title" content="CadForn - Cadastro de Fornecedores" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://marlimota.github.io/cadForn/" />
  <meta property="og:description" content="Sistema desenvolvido com Laravel para cadastro de Fornecedores" />

  <meta property="og:image" content="https://i.imgur.com/Z6p2FmW.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="885">
  <meta property="og:image:height" content="440">
  <!--favicon-->
  <link rel="icon" type="image/x-icon" href="images/favicon.ico" />
  <!--Estilos-->
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link href="{{ asset('/css/style.css') }}" rel="stylesheet">
  <!--Links jquery-->
  <script type="text/javascript" src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
  <script src="js/jquery-1.2.6.pack.js" type="text/javascript"></script>
  <script src="js/jquery.maskedinput-1.1.4.pack.js" type="text/javascript"></script>
  </script>
</head>

<body class="background-cadastro">
  <?php

  //session_start();

  if (!isset($_SESSION['usuario'])) {
    echo ('Você não está logado');
  } else {
    //echo ($_SESSION['usuario']);
  }

  ?>
  <div id="page-container">
    <div id="content-wrap">

      <nav class="barraSuperior">
        <div class="barraSuperiorLogo">
          <h1>CadForn</h1>
          <h4>Cadastro de Fornecedores</h4>
        </div>
        <div class="logout">
          <button type="button" onclick="Logout()">
            <i class="fa fa-power-off"></i>
            <!-- <h6>Sair</h6> -->
          </button>
        </div>
      </nav>

      <div class="cadastro">
        <section class="title">
          <h2>Fornecedores</h2>
          <div class="titleButton">
            <button class="btn" onclick="SetNewProviderScreenVisibility(true)"><i class="fa fa-plus"></i>
              Adicionar</button>
            <input autocomplete="off" id="searchbox" oninput="Search(this.value)" placeholder="Buscar">
          </div>
        </section>
        <section class="providers">
          <div>
            <table class="table table-striped">
              <thead class="table-title">
                <tr>
                  <th>Nome Fantasia</th>
                  <th>Razão Social</th>
                  <th>CNPJ</th>
                  <th>Telefone</th>
                  <th>Celular</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody id="providersTable">
                <!--espaço reservado para a tabela que é criada pela função FetchAll-->
              </tbody>
            </table>
          </div>
        </section>
        <section class="arrows">
          <!--setas para mudança de página-->
          <div id="numberPage"></div>
          <a id="previewButton" onclick="ChangePage(-1)"><i class="fa fa-chevron-left"></i></a>
          <a id="nextButton" onclick="ChangePage(1)"><i class="fa fa-chevron-right"></i></a>
        </section>
      </div>


      <!--toda a parte que aparece sobrepondo a tela principal - nova página que aparece acima da anterior 
    - tabela, botões e "sombra cinza"-->
      <div id="pageOverlay">
        <div class="cadastro">
          <section class="providers" id="overlayWhiteBox">
            <table id="itens" class="table table-striped">
              <tr>
                <th>Nome Fantasia</th>
                <input type="hidden" name="pageNumber" id="pageNumber">
                <td> <input type="text" name="nomeFantasia" id="nomeFantasia" placeholder="Nome Fantasia"
                    autocomplete="off"></td>
              </tr>
              <tr>
                <th>Razão Social</th>
                <td> <input type="text" name="razaoSocial" id="razaoSocial" placeholder="Razão Social"
                    autocomplete="off">
                </td>
              </tr>
              <tr>
                <th>CNPJ</th>
                <td> <input type="text" name="cnpj" id="cnpj" placeholder="CNPJ" autocomplete="off"></td>
              </tr>
              <tr>
                <th>Telefone</th>
                <td> <input type="tel" name="telefone" id="telefone" placeholder="Telefone" autocomplete="off"></td>
              </tr>
              <tr>
                <th>Celular</th>
                <td> <input type="tel" name="celular" id="celular" placeholder="Celular" autocomplete="off"></td>
              </tr>
              <tr>
                <th>Endereço</th>
                <td> <input type="text" name="endereco" id="endereco" placeholder="Endereço" autocomplete="off"></td>
              </tr>
              <tr>
                <th>E-mail</th>
                <td> <input type="email" name="email" id="email" placeholder="E-mail" autocomplete="off"></td>
              </tr>
              <tr>
                <th>Site</th>
                <td> <input type="text" name="site" id="site" placeholder="Site" autocomplete="off"></td>
              </tr>
              <tr>
                <th>Produto</th>
                <td> <input type="text" name="produto" id="produto" placeholder="Produto" autocomplete="off"></td>
              </tr>
              <tr>
                <th>Contrato</th>
                <td> <input type="text" name="contrato" id="contrato" placeholder="Contrato" autocomplete="off"></td>
              </tr>
              <tr>
                <th>Inicio do Contrato</th>
                <td> <input type="date" name="inicioDoContrato" id="inicioDoContrato" placeholder="" autocomplete="off">
                </td>
              </tr>
              <tr>
                <th>Fim do Contrato</th>
                <td> <input type="date" name="fimDoContrato" id="fimDoContrato" placeholder="" autocomplete="off"></td>
              </tr>
              <tr>
                <th>Responsável</th>
                <td>
                  <select class="form-select" name="responsavel" id="responsavel">
                  </select>
                </td>
              </tr>
              <tr>
                <th>Observação</th>
                <td> <input type="text" name="observacao" id="observacao" placeholder="Observação" autocomplete="none">
                  </input> </td>
              </tr>
            </table>

          </section>

          <!--botões-->
          <section class="buttonBoxes" id="addProviderButtonBox">
            <Button type="button" onclick="SetPageOverlayVisibility (false)" class="btn cancel"
              id="newprovider-cancel-btn"><i class="fa fa-trash"></i>
              Descartar</Button>
            <Button onclick="SaveNewProvider()" type="button" class="btn confirm" id="newprovider-confirm-btn"><i
                class="fa fa-check"></i>
              Salvar</Button>
          </section>
          <section class="buttonBoxes" id="detailsButtonBox">
            <Button type="button" onclick="SetPageOverlayVisibility(false)" class="btn cancel"
              id="details-cancel-btn"><i class="fa fa-times"></i> Fechar</Button>
            <button onclick="Print()" class="btn confirm"><i class="fa fa-print"></i> Imprimir</button>
          </section>
          <section class="buttonBoxes" id="editButtonBox">
            <Button type="button" onclick="SetPageOverlayVisibility (false)" class="btn cancel" id="edit-cancel-btn"><i
                class="fa fa-times"></i>
              Cancelar</Button>
            <Button class="btn confirm" id="edit-confirm-btn"><i class="fa fa-check"></i>
              Salvar</Button>
          </section>
        </div>
      </div>
    </div>
    <footer id="footer">

      <h6>© 2021 Autodoc. Todos os direitos reservados.</h6>

    </footer>
  </div>

  <script src="js/dashboard_script.js"></script>
</body>

</html>