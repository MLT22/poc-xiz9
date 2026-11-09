# Diário de pesquisa — PoC Xiz9 móvel

## Contexto do TCC

O TCC é o Xiz9, uma API REST que detecta imagens geradas por IA. A análise é feita por uma rede neural com arquitetura EfficientNet V2 Small. O Xiz9 foi pensado para ser consumido por plataformas parceiras, mas até agora só foi testado por um site. Esta prova de conceito é um cliente móvel mínimo, feito em React Native com Expo.

## Pergunta de pesquisa

Como o expo-image-picker e o fetch permitem que um app Expo envie uma foto à API do Xiz9 e exiba o veredito e a confiança, na condição de a análise ser lenta e a conexão poder falhar?

## Mapa do tema com IA

Mesmo prompt enviado a duas ferramentas: Claude Code e Github copilot.

| Ponto | Claude code  | Github copilot | O que a documentação oficial confirma |
| --- | --- | --- | --- |
| Quais bibliotecas acha que devo utilizar na minha poc? | O Claudio recomendou a utilização da biblioteca 'expo-image-picker' (pegar a imagem da camera/galeria), utilizar o 'expo/fetch' do proprio SO e AbortController para o controle da requisição | O Github copilot sugeriu a também a utilização do 'expo-image-picker', eviar o arquivo via 'expo/fetch' e enviar o arquivo com 'FormData' | A documentação condiz com a sugestão de ambas as ferramentas |

## Como funciona

1. O usuário toca em um botão e o `expo-image-picker` abre a galeria ou a câmera.
2. O picker devolve o resultado com o endereço (`uri`) da imagem no aparelho.
3. O app monta um `FormData` com a imagem e envia um `POST` com `fetch` ao endpoint /Xiz9/analise da API, no campo file.
4. A API devolve um JSON com os campos: veredito, confiança.
5. O app guarda o estado (ocioso, enviando, sucesso, erro) e mostra o resultado correspondente.

## Alternativas consideradas

| Opção | Serve para | Funciona no Expo Go? | Decisão |
| --- | --- | --- | --- |
| expo-image-picker | Abrir a galeria ou a câmera do sistema | Sim | **Escolhida.** Dá acesso à galeria e permite tirar uma foto na hora, com uma única biblioteca. |
| expo-camera | Mostrar a câmera dentro do app | Sim | Descartada. Exigiria montar a interface da câmera e, ainda assim, não abre a galeria. O image-picker já cobre os dois casos. |
| expo-document-picker | Abrir o seletor de arquivos do sistema | Sim | Descartada. Abre o gerenciador de arquivos, não a galeria, o que é menos prático para escolher fotos. |
| fetch global / expo/fetch | Fazer requisições HTTP | Sim, vem no pacote `expo` | **Escolhida.** É a implementação de fetch do próprio Expo (compatível com WinterCG) e, nas SDKs recentes, também é o `fetch` global no Android e no iOS. Não exige dependência extra. |  
| axios | Biblioteca externa para requisições | Sim | Descartada. Seria uma dependência a mais sem benefício para uma única requisição. |

## Fontes oficiais lidas

- expo-document-picker: https://docs.expo.dev/versions/v58.0.0/sdk/document-picker/
- expo-camera: https://docs.expo.dev/versions/v58.0.0/sdk/camera/
- expo-image-picker: https://docs.expo.dev/versions/v58.0.0/sdk/imagepicker/
- expo/fetch: https://docs.expo.dev/versions/v58.0.0/sdk/expo/#expofetch-api
- axios: https://github.com/axios/axios

## Onde a IA errou

Erro verificado:

- Pedi uma tela que conseguisse pegar imagens ( ou da galeria ou da câmera), enviar para análise e uma miniatura da imagem escolhida. A IA entregou exatamente isso. Ao testar no aparelho, percebi que não havia como remover a imagem selecionada. A falha estava na minha especificação, não na resposta, e virou um novo critério de aceitação.
- Pedi para quando uma requisição tiver uma falha explicasse qual foi a falha. Obitive que qualquer tipo de erro era por conta da API do Xiz9 estava fora do ar e mostrava a URL de acesso da API, mesmo no caso de ter desligado a internet do celular apareceu o erro falando que a API do Xiz9 estava fora do ar.
## Teste das condições: análise lenta e conexão com falha

Cada situação foi testada no emulador, com o app rodando.

| Situação | Como provoquei | O que o app mostrou | Passou? |
| --- | --- | --- | --- |
| API fora do ar | Pare o servidor | Apareceu um card informando que não foi possivel acessar se conectar a API do Xiz9 | Sim |
| Celular sem internet | Desabilitei o Wi-fi e o rede movel do celular | Apareceu o mesmo erro falando que não foi possivel conectar na API do Xiz9 | Sim |
| Nova tentativa após falha | Religuei a conexão e toquei para analisar  | Veredito exibido | Sim |
| Longo tempo de espera | Crie um script em python que fica enviando várias requisições para a API do Xiz9 | Apos enviar a imagem para a analise, apareceu um icone mostrando que estava esperando a requisição e apos 8 segundos esperando o resultado apareceu o resultado  | Sim |

Tempo medido de uma análise: 1 segundo, no Wi-fi.

## Resultado e próximos passos no TCC

- O que a PoC demonstrou: Um cliente móvel feito com Expo (SDK 58) consegue consumir o Xiz9 sem nenhuma alteração na API. O `expo-image-picker` obtém a foto da galeria ou da câmera, o `fetch` a envia em `multipart/form-data` no campo `file`, e o app exibe o veredito e a confiança. Com isso, o Xiz9 passa a ter um segundo tipo de cliente validado, além do site. Todos os critérios de aceitação passaram nos testes no emulador.
- O que os testes mostraram:
  - Em condição normal, uma análise levou cerca de 1 segundo.
  - Com um script enviando requisições simultâneas, a espera subiu para cerca de 8 segundos. O tempo de resposta do Xiz9 cresce com a concorrência, e o app manteve o indicador de espera até exibir o resultado.
  - Com a API fora do ar ou sem conexão, o app mostrou um card de erro, e uma nova tentativa funcionou depois que a conexão voltou.
  - Limitações: o tempo limite de 60 segundos do app não foi atingido nos testes; o app mostra a mesma mensagem para API fora do ar e para falta de conexão; e os testes usaram emulador com a API local, sem a latência de uma rede real.
- O que muda no TCC:
  - Tratar o tempo de resposta sob requisições simultâneas como requisito do Xiz9, já que a espera observada cresceu com a carga.
- Próximos passos:
  - Medir quantas requisições simultâneas o Xiz9 suporta e avaliar uma fila ou um processamento assíncrono, caso o tempo de espera fique inviável para as plataformas parceiras.
  - Melhorar como a API trabalha com concorrencia.