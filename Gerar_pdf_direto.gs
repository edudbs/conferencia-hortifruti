function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Relatórios')
    .addItem('Gerar PDF de conferência por data', 'abrirDialogoPdfLancamentoPorData_')
    .addToUi();
}

function abrirDialogoPdfLancamentoPorData_() {
  const html = HtmlService.createHtmlOutput(`
<!DOCTYPE html>
<html>
<head>
  <base target="_top">

  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      color: #1f2933;
    }

    h2 {
      margin-top: 0;
      color: #166c3a;
    }

    input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px;
      font-size: 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      margin-top: 10px;
    }

    button {
      margin-top: 16px;
      width: 100%;
      padding: 12px;
      font-size: 16px;
      border: 0;
      border-radius: 8px;
      background: #166c3a;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all .15s ease;
    }

    button:hover {
      opacity: .95;
    }

    button:active {
      transform: scale(0.98);
    }

    button:disabled {
      opacity: .7;
      cursor: wait;
    }

    .erro {
      color: #b91c1c;
      margin-top: 12px;
      font-size: 14px;
    }
  </style>
</head>

<body>
  <h2>Gerar PDF de conferência</h2>

  <input
    id="data"
    type="text"
    placeholder="dd/mm/aaaa"
    maxlength="10"
  >

  <button onclick="gerar()">Gerar PDF</button>

  <div id="resultado" class="erro"></div>

  <script>
    const input = document.getElementById('data');

    input.focus();
    
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        gerar();
      }
    });  
    
    input.addEventListener('input', function(e) {
      let valor = e.target.value.replace(/\\D/g, '');

      if (valor.length > 8) {
        valor = valor.slice(0, 8);
      }

      if (valor.length > 4) {
        valor =
          valor.slice(0, 2) + '/' +
          valor.slice(2, 4) + '/' +
          valor.slice(4);
      } else if (valor.length > 2) {
        valor =
          valor.slice(0, 2) + '/' +
          valor.slice(2);
      }

      e.target.value = valor;
    });

function gerar() {
  const resultado = document.getElementById('resultado');
  const botao = document.querySelector('button');

  resultado.innerHTML = '';

  const valor = input.value.trim();

  if (!/^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(valor)) {
    resultado.innerHTML = 'Informe a data no formato dd/mm/aaaa.';
    return;
  }

  const partes = valor.split('/');

  const dataIso =
    partes[2] + '-' +
    partes[1] + '-' +
    partes[0];

  botao.disabled = true;
  botao.innerHTML = 'Gerando PDF...';

  google.script.run
    .withSuccessHandler(function(resultadoPdf) {

      botao.disabled = false;
      botao.innerHTML = 'Gerar PDF';

      if (!resultadoPdf || !resultadoPdf.sucesso) {
        resultado.innerHTML =
          'Falha ao gerar PDF.';
        return;
      }

      resultado.innerHTML =
        '<div style="color:#166c3a;font-weight:bold;">' +
        'PDF gerado com sucesso!' +
        '</div>' +

        '<div style="margin-top:10px;">' +
        resultadoPdf.nomeArquivo +
        '</div>' +

        '<div style="margin-top:14px;">' +
        '<a href="' + resultadoPdf.url + '" target="_blank">' +
        'Abrir PDF no Drive' +
        '</a>' +
        '</div>';
    })

    .withFailureHandler(function(err) {

      botao.disabled = false;
      botao.innerHTML = 'Gerar PDF';

      resultado.innerHTML =
        err && err.message
          ? err.message
          : 'Erro ao gerar PDF.';
    })

    .gerarPdfLancamentoPorDataDireto(dataIso);
}
  </script>
</body>
</html>
  `)
    .setWidth(420)
    .setHeight(260);

  SpreadsheetApp
    .getUi()
    .showModalDialog(html, 'Gerar PDF');
}

function gerarPdfLancamentoPorDataDireto_(dataFiltro) {
  return gerarPdfLancamentoPorData_({
    parameter: {
      dataConferencia: dataFiltro
    }
  });
}


function gerarPdfLancamentoPorDataDireto(dataFiltro) {
  const resultado = gerarPdfLancamentoPorDataObjeto_(dataFiltro);

  return resultado;
}