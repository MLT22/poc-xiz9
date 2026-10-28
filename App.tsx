import { StatusBar } from 'expo-status-bar';
import type { ImagePickerAsset } from 'expo-image-picker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import BotaoAnalisar from './components/BotaoAnalisar';
import SeletorDeImagem from './components/SeletorDeImagem';

export default function App() {
  // Guarda o asset inteiro: uri, mimeType e fileName serão usados no envio à API.
  const [imagem, setImagem] = useState<ImagePickerAsset | null>(null);

  // A integração com o Xiz9 ainda não foi feita.
  const analisar = () => {};

  return (
    <View style={styles.container}>
      <SeletorDeImagem imagem={imagem} onSelecionar={setImagem} />
      <BotaoAnalisar desativado={imagem === null} onAnalisar={analisar} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    padding: 16,
  },
});
