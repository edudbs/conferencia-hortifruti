/**
 * CONFIGURAÇÃO
 * Crie uma pasta no Drive para os PDFs de lançamento e cole o ID aqui.
 * O ID é o trecho da URL entre /folders/ e o próximo ? ou fim da URL.
 */
const ID_PASTA_RELATORIOS_LANCAMENTO = '1HgzsaeujZyoxP_AyeN8mCf_uF9hmiCRG';

/**
 * Integre este trecho ao seu doPost(e) atual.
 *
 * Exemplo:
 *
 * function doPost(e) {
 *   const action = e.parameter.action;
 *
 *   if (action === 'salvarPdfLancamento') {
 *     return salvarPdfLancamento_(e);
 *   }
 *
 *   if (action === 'salvarConferencia') {
 *     return salvarConferencia_(e);
 *   }
 *
 *   return ContentService.createTextOutput('Ação inválida');
 * }
 */
function salvarPdfLancamento_(e) {
  const payload = JSON.parse(e.parameter.payload || '{}');

  if (!payload || !payload.itens || !payload.itens.length) {
    return ContentService
      .createTextOutput('Sem itens para gerar PDF')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  const nomeArquivo = sanitizarNomeArquivo_(
    payload.nomeArquivo ||
    ('Relatorio_Conferencia_' + formatarDataArquivoApps_(payload.dataConferencia))
  );

  const html = montarHtmlPdfLancamento_(payload);

  const blob = Utilities
    .newBlob(html, MimeType.HTML, nomeArquivo + '.html')
    .getAs(MimeType.PDF)
    .setName(nomeArquivo + '.pdf');

  const pasta = DriveApp.getFolderById(ID_PASTA_RELATORIOS_LANCAMENTO);
  const arquivo = pasta.createFile(blob);

  const resultado = {
  sucesso: true,
  nomeArquivo: arquivo.getName(),
  fileId: arquivo.getId(),
  url: arquivo.getUrl()
};

const requestId = e.parameter.requestId || '';

if (requestId) {
  CacheService
    .getScriptCache()
    .put('pdf_lancamento_' + requestId, JSON.stringify(resultado), 600);
}

return responderIframeDrive_(resultado);
}

function montarHtmlPdfLancamento_(payload) {
  const itens = payload.itens || [];

  const linhas = itens.map(function(item) {
    const unidade = item.unidade || 'kg/un';
    const codigo = item.codigo || '-';

    return ''
      + '<tr>'
      + '<td class="produto">'
      + '<div class="produto-nome">' + escaparHtml_(item.produto || '-') + '</div>'
      + '<div class="produto-codigo">Cód. ' + escaparHtml_(codigo) + '</div>'
      + '</td>'
      + '<td>' + formatarNumeroApps_(item.caixas) + '</td>'
      + '<td>' + formatarNumeroApps_(item.qtdPeso) + ' ' + escaparHtml_(unidade) + '</td>'
      + '<td>' + escaparHtml_(item.observacao || '-') + '</td>'
      + '</tr>';
  }).join('');

  const observacaoGeral = payload.observacaoGeral
    ? '<div class="meta-item obs-geral"><span>Observação geral</span>'
      + escaparHtml_(payload.observacaoGeral)
      + '</div>'
    : '';

  return ''
    + '<!DOCTYPE html>'
    + '<html>'
    + '<head>'
    + '<meta charset="UTF-8">'
    + '<style>'
    + '@page { size: A4; margin: 14mm; }'
    + 'body { font-family: Arial, sans-serif; color: #1f2933; font-size: 12px; }'
    + '.topo { text-align: center; margin-bottom: 14px; }'
    + '.topo h1 { margin: 0; color: #166c3a; font-size: 18px; }'
    + '.topo p { margin: 4px 0 0; color: #6b7280; }'
    + '.meta { display: table; width: 100%; margin-bottom: 12px; border-collapse: collapse; }'
    + '.meta-item { display: table-cell; border: 1px solid #e5e7eb; padding: 8px; vertical-align: middle; }'
    + '.meta-item span { display: block; color: #6b7280; font-size: 10px; font-weight: bold; margin-bottom: 3px; text-transform: uppercase; }'
    + '.obs-geral { display: block; margin-bottom: 12px; }'
    + 'table { width: 100%; border-collapse: collapse; table-layout: fixed; }'
    + 'th, td { border: 1px solid #e5e7eb; padding: 7px; vertical-align: middle; }'
    + 'th { background: #eef8f1; color: #166c3a; text-align: center; font-size: 11px; }'
    + 'th:nth-child(1), td:nth-child(1) { width: 42%; }'
    + 'th:nth-child(2), td:nth-child(2) { width: 11%; text-align: center; }'
    + 'th:nth-child(3), td:nth-child(3) { width: 21%; text-align: center; }'
    + 'th:nth-child(4), td:nth-child(4) { width: 26%; text-align: center; }'
    + '.produto { text-align: left !important; }'
    + '.produto-nome { font-weight: bold; line-height: 1.2; }'
    + '.produto-codigo { margin-top: 3px; color: #6b7280; font-size: 10px; }'
    + '.assinatura { margin-top: 34px; text-align: center; color: #6b7280; }'
    + '.linha-assinatura { width: 260px; border-top: 1px solid #6b7280; margin: 0 auto 6px; }'
    + '</style>'
    + '</head>'
    + '<body>'
    + '<div class="topo">'
    + '<h1>RELATÓRIO DE LANÇAMENTO HORTIFRUTI</h1>'
    + '<p>Documento operacional de conferência</p>'
    + '</div>'
    + '<div class="meta">'
    + '<div class="meta-item"><span>Data</span>' + escaparHtml_(formatarDataBRApps_(payload.dataConferencia)) + '</div>'
    + '<div class="meta-item"><span>Conferente</span>' + escaparHtml_(payload.usuario || '-') + '</div>'
    + '<div class="meta-item"><span>Itens conferidos</span>' + escaparHtml_(String(payload.totalItens || itens.length || 0)) + '</div>'
    + '</div>'
    + observacaoGeral
    + '<table>'
    + '<thead><tr>'
    + '<th>Produto</th>'
    + '<th>Caixas</th>'
    + '<th>Qtde/Peso Líquido Total</th>'
    + '<th>Observação</th>'
    + '</tr></thead>'
    + '<tbody>' + linhas + '</tbody>'
    + '</table>'
    + '<div class="assinatura"><div class="linha-assinatura"></div>Assinatura do conferente</div>'
    + '</body>'
    + '</html>';
}

function formatarDataArquivoApps_(dataISO) {
  if (!dataISO) return 'sem_data';

  const partes = String(dataISO).split('-');

  if (partes.length !== 3) {
    return String(dataISO).replace(/[^0-9a-zA-Z._-]/g, '_');
  }

  return partes[2] + '.' + partes[1] + '.' + partes[0];
}

function formatarDataBRApps_(dataISO) {
  if (!dataISO) return '-';

  const partes = String(dataISO).split('-');

  if (partes.length !== 3) return dataISO;

  return partes[2] + '/' + partes[1] + '/' + partes[0];
}

function formatarNumeroApps_(valor) {
  const numero = Number(valor || 0);

  return String(Number(numero.toFixed(3))).replace('.', ',');
}

function sanitizarNomeArquivo_(nome) {
  return String(nome || 'Relatorio_Conferencia')
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .trim();
}

function escaparHtml_(valor) {
  return String(valor == null ? '' : valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


function responderIframeDrive_(dados) {
  const json = JSON.stringify(dados).replace(/</g, '\\u003c');

  const html = `
<!DOCTYPE html>
<html>
  <body>
    <script>
      (function () {
        var dados = ${json};

        try {
          window.parent.postMessage(dados, '*');
        } catch (e) {}

        try {
          window.top.postMessage(dados, '*');
        } catch (e) {}
      })();
    </script>
  </body>
</html>`;

  return ContentService
    .createTextOutput(html)
    .setMimeType(ContentService.MimeType.HTML);
}

function responderErroIframeDrive_(erro) {
  return responderIframeDrive_({
    sucesso: false,
    erro: erro && erro.message ? erro.message : String(erro)
  });
}


function consultarPdfLancamento_(e) {
  const requestId = e.parameter.requestId || '';

  if (!requestId) {
    return responder_({
      sucesso: false,
      erro: 'requestId não informado.'
    }, e);
  }

  const valor = CacheService
    .getScriptCache()
    .get('pdf_lancamento_' + requestId);

  if (!valor) {
    return responder_({
      sucesso: false,
      pendente: true
    }, e);
  }

  return responder_(JSON.parse(valor), e);
}


function regenerarPdfLancamento_(e) {
  const dataEnvioFiltro = String(e.parameter.dataEnvio || '').trim();

  if (!dataEnvioFiltro) {
    throw new Error('Informe dataEnvio.');
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName('CONFERENCIAS');

  if (!aba) {
    throw new Error('Aba CONFERENCIAS não encontrada.');
  }

  const dados = aba.getDataRange().getValues();
  const cabecalho = dados[0];

  const idx = nome => cabecalho.indexOf(nome);

  const linhas = dados.slice(1).filter(linha => {
    const dataEnvio = linha[idx('data_envio')];

    const textoDataEnvio =
      dataEnvio instanceof Date
        ? Utilities.formatDate(dataEnvio, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss')
        : String(dataEnvio).trim();

    return textoDataEnvio === dataEnvioFiltro;
  });

  if (linhas.length === 0) {
    throw new Error('Nenhuma conferência encontrada para data_envio: ' + dataEnvioFiltro);
  }

  const primeira = linhas[0];

  const payload = {
    tipoRelatorio: 'lancamento',
    nomeArquivo: 'Relatorio_Conferencia_' + dataEnvioFiltro.replace(/[/: ]/g, '_'),
    dataConferencia: primeira[idx('data_conferencia')] instanceof Date
      ? Utilities.formatDate(
        primeira[idx('data_conferencia')],
        Session.getScriptTimeZone(),
        'dd/MM/yyyy'
      )
    : primeira[idx('data_conferencia')],
    usuario: primeira[idx('usuario')] || '',
    observacaoGeral: primeira[idx('observacao_geral')] || '',
    totalItens: linhas.length,
    itens: linhas.map(linha => ({
      codigo: linha[idx('codigo')],
      produto: linha[idx('produto')],
      caixas: linha[idx('caixas')],
      qtdPeso: linha[idx('qtd_peso')],
      unidade: linha[idx('unidade')],
      observacao: linha[idx('observacao')] || ''
    }))
  };

  const html = montarHtmlPdfLancamento_(payload);

  const blob = Utilities
    .newBlob(html, MimeType.HTML, payload.nomeArquivo + '.html')
    .getAs(MimeType.PDF)
    .setName(payload.nomeArquivo + '.pdf');

  const pasta = DriveApp.getFolderById(ID_PASTA_RELATORIOS_LANCAMENTO);
  const arquivo = pasta.createFile(blob);

  return responder_({
    sucesso: true,
    nomeArquivo: arquivo.getName(),
    fileId: arquivo.getId(),
    url: arquivo.getUrl()
  }, e);
}


function diagnosticarDatasEnvio_(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName('CONFERENCIAS');

  if (!aba) {
    throw new Error('Aba CONFERENCIAS não encontrada.');
  }

  const dados = aba.getDataRange().getValues();
  const cabecalho = dados[0];
  const idxDataEnvio = cabecalho.indexOf('data_envio');

  if (idxDataEnvio === -1) {
    throw new Error('Coluna data_envio não encontrada.');
  }

  const timezone = Session.getScriptTimeZone();

  const datas = dados.slice(1, 20).map((linha, i) => {
    const valor = linha[idxDataEnvio];

    return {
      linha: i + 2,
      bruto: String(valor),
      tipo: Object.prototype.toString.call(valor),
      formatado:
        valor instanceof Date
          ? Utilities.formatDate(valor, timezone, 'dd/MM/yyyy HH:mm:ss')
          : String(valor).trim()
    };
  });

  return responder_({
    sucesso: true,
    datas: datas
  }, e);
}