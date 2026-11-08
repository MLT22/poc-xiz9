import { StyleSheet, Text, View } from 'react-native';

type Props = {
  mensagem: string;
};

export default function CardErro({ mensagem }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Falha na análise</Text>
      <Text style={styles.mensagem}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 16,
    borderWidth: 2,
    borderColor: '#c62828',
    borderRadius: 8,
    backgroundColor: '#fdecea',
    gap: 4,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c62828',
  },
  mensagem: {
    fontSize: 14,
  },
});
