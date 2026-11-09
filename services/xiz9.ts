import { fetch } from 'expo/fetch';
import { File } from 'expo-file-system';

// No emulador Android, 10.0.2.2 aponta para o localhost do computador onde a API roda.
const URL_ANALISE = 'http://10.0.2.2:8000/Xiz9/analise';

// A análise do modelo pode ser lenta; depois disso a requisição é cancelada.
const TEMPO_LIMITE_MS = 60_000;

export type ResultadoXiz9 = {
  label: 'REAL' | 'IA' | 'INCERTO';
  confidence: number;
};

export async function analisarImagem(uri: string): Promise<ResultadoXiz9> {
  // O fetch do SDK 58 (expo/fetch) não aceita { uri, name, type } no FormData;
  // o File do expo-file-system funciona como Blob e leva o nome e o tipo MIME do arquivo.
  const formData = new FormData();
  formData.append('file', new File(uri));

  const controller = new AbortController();
  const temporizador = setTimeout(() => controller.abort(), TEMPO_LIMITE_MS);

  let resposta;
  try {
    resposta = await fetch(URL_ANALISE, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
  } catch {
    // O expo/fetch não usa AbortError, então o tempo esgotado é detectado pelo signal.
    if (controller.signal.aborted) {
      throw new Error(`Tempo esgotado: a análise passou de ${TEMPO_LIMITE_MS / 1000} s.`);
    }
    // A URL da API nunca vai para a tela.
    throw new Error('Não foi possível conectar ao serviço do Xiz9.');
  } finally {
    clearTimeout(temporizador);
  }

  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status}: ${await lerDetalhe(resposta)}`);
  }

  try {
    return (await resposta.json()) as ResultadoXiz9;
  } catch {
    throw new Error('A API respondeu, mas o conteúdo não é um JSON válido.');
  }
}

// O FastAPI devolve erros como { detail: string } ou, na validação, { detail: [...] }.
async function lerDetalhe(resposta: { text: () => Promise<string> }): Promise<string> {
  const texto = await resposta.text();
  try {
    const { detail } = JSON.parse(texto);
    return typeof detail === 'string' ? detail : JSON.stringify(detail);
  } catch {
    return texto || 'resposta sem detalhes';
  }
}
