import { StatusBar } from 'expo-status-bar';
import type { ImagePickerAsset } from 'expo-image-picker';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import BotaoAnalisar from './components/BotaoAnalisar';
import CardErro from './components/CardErro';
import CardResultado from './components/CardResultado';
import SeletorDeImagem from './components/SeletorDeImagem';
import { analisarImagem, type ResultadoXiz9 } from './services/xiz9';

// Um único estado para a análise: não existe "carregando" com resultado ou erro ao mesmo tempo.
type Analise =
  | { status: 'ocioso' }
  | { status: 'carregando' }
  | { status: 'sucesso'; resultado: ResultadoXiz9 }
  | { status: 'erro'; mensagem: string };

export default function App() {
  // Guarda o asset inteiro: a uri é usada no envio à API.
  const [imagem, setImagem] = useState<ImagePickerAsset | null>(null);
  const [analise, setAnalise] = useState<Analise>({ status: 'ocioso' });

  const carregando = analise.status === 'carregando';

  // Trocar ou remover a imagem invalida o resultado anterior.
  const selecionar = (novaImagem: ImagePickerAsset) => {
    setImagem(novaImagem);
    setAnalise({ status: 'ocioso' });
  };

  const remover = () => {
    setImagem(null);
    setAnalise({ status: 'ocioso' });
  };

  const analisar = async () => {
    if (!imagem) return;

    setAnalise({ status: 'carregando' });
    try {
      const resultado = await analisarImagem(imagem.uri);
      setAnalise({ status: 'sucesso', resultado });
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : String(erro);
      setAnalise({ status: 'erro', mensagem });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SeletorDeImagem
        imagem={imagem}
        onSelecionar={selecionar}
        onRemover={remover}
        desativado={carregando}
      />
      <BotaoAnalisar
        desativado={imagem === null}
        carregando={carregando}
        onAnalisar={analisar}
      />
      {analise.status === 'sucesso' && <CardResultado resultado={analise.resultado} />}
      {analise.status === 'erro' && <CardErro mensagem={analise.mensagem} />}
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    padding: 16,
  },
});
