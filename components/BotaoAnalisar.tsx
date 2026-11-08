import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';

type Props = {
  desativado: boolean;
  carregando: boolean;
  onAnalisar: () => void;
};

export default function BotaoAnalisar({ desativado, carregando, onAnalisar }: Props) {
  return (
    <View style={styles.container}>
      <Button
        title={carregando ? 'Analisando...' : 'Analisar'}
        onPress={onAnalisar}
        disabled={desativado || carregando}
      />
      {carregando && <ActivityIndicator />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
