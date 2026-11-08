import { StyleSheet, Text, View } from 'react-native';

import type { ResultadoXiz9 } from '../services/xiz9';

const CORES: Record<ResultadoXiz9['label'], string> = {
  REAL: '#1b8a3a',
  IA: '#c62828',
  INCERTO: '#b26a00',
};

type Props = {
  resultado: ResultadoXiz9;
};

export default function CardResultado({ resultado }: Props) {
  const cor = CORES[resultado.label];

  return (
    <View style={[styles.card, { borderColor: cor }]}>
      <Text style={styles.titulo}>Resultado</Text>
      <Text style={[styles.veredito, { color: cor }]}>{resultado.label}</Text>
      <Text style={styles.confianca}>
        Confiança: {(resultado.confidence * 100).toFixed(1)}%
      </Text>
      {resultado.label === 'INCERTO' && (
        <Text style={styles.nota}>Confiança abaixo de 75%, o modelo não conclui.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 16,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  titulo: {
    fontSize: 14,
    color: '#555',
  },
  veredito: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  confianca: {
    fontSize: 16,
  },
  nota: {
    fontSize: 12,
    color: '#555',
  },
});
