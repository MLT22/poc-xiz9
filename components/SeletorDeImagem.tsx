import * as ImagePicker from 'expo-image-picker';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  imagem: ImagePicker.ImagePickerAsset | null;
  onSelecionar: (imagem: ImagePicker.ImagePickerAsset) => void;
};

export default function SeletorDeImagem({ imagem, onSelecionar }: Props) {
  // A galeria não exige permissão: o Android usa o seletor de fotos do sistema.
  // Sem edição e com quality 1 para não recortar nem recomprimir a imagem que será analisada.
  const escolherDaGaleria = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!resultado.canceled) {
      onSelecionar(resultado.assets[0]);
    }
  };

  // A câmera sempre exige permissão, pedida no momento do toque.
  const tirarFoto = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à câmera para tirar uma foto.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({ quality: 1 });

    if (!resultado.canceled) {
      onSelecionar(resultado.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>Foto</Text>
      <View style={styles.botoes}>
        <Button title="Galeria" onPress={escolherDaGaleria} />
        <Button title="Câmera" onPress={tirarFoto} />
      </View>
      {imagem ? (
        <Image source={{ uri: imagem.uri }} style={styles.miniatura} />
      ) : (
        <Text style={styles.vazio}>Nenhuma imagem selecionada</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  rotulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  botoes: {
    flexDirection: 'row',
    gap: 12,
  },
  miniatura: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  vazio: {
    color: '#888',
  },
});
