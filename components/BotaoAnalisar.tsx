import { Button } from 'react-native';

type Props = {
  desativado: boolean;
  onAnalisar: () => void;
};

export default function BotaoAnalisar({ desativado, onAnalisar }: Props) {
  return <Button title="Analisar" onPress={onAnalisar} disabled={desativado} />;
}
