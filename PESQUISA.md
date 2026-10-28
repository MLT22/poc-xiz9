# Pesquisa — PoC Xiz9 móvel

## Contexto do TCC

O TCC é o Xiz9, uma API REST que detecta imagens geradas por IA. A análise é realizada utilizando uma rede neural, na qual foi utilizada a arquitetura EfficientNet V2 Small. O Xiz9 foi pensado para ser consumido por plataformas parceiras, mas até agora só foi testado por um site. Esta prova de conceito é um cliente móvel mínimo, feito em React Native com Expo, para a disciplina de Desenvolvimento de Aplicações Híbridas (trilhas: recursos do aparelho e consumo de API).

## Pergunta de pesquisa

Como o expo-image-picker e o fetch permitem que um app Expo envie uma foto à API do Xiz9 e exiba o veredito e a confiança, na condição de a análise ser lenta e a conexão poder falhar?

## Alternativas consideradas

| Opção | Serve para | Decisão |
| --- | --- | --- |
| [opção] | [para que serve] | [decisão e motivo] |
| expo-document-picker | Abre o seletor de arquivos do SO | Decidi não seguir com a utilização dessa biblioteca, pois como essa biblioteca abre o seletor de arquivos e não a galeria ficaria menos prático a utilização |
| expo-camera | Mostra a câmera | Decidi não utilizar, pois creio que para essa PoC seria melhor ter duas opções ou de selecionar da galeria ou tirar uma foto na hora |
| expo-image-picker | Abrir a galeria/câmera do sistema | Decidi seguir utilizando essa biblioteca, por conseguir ter acesso tanto a galeria do celular, quanto tirar uma foto na hora |
| expo/fetch | Fazer requisições | É o metodo que decidi utilizar, por já ser nativo do Android |
| XMLHttpRequest | Fazer requisições | Maneira inbutida no React Native |
| axios | Biblioteca externa do javascript para fazer requisição | Por ser uma dependência a mais prefiri não utilizar |


## Fontes oficiais lidas

- expo-document-picker: https://docs.expo.dev/versions/v58.0.0/sdk/document-picker/
- expo-camera: https://docs.expo.dev/versions/v58.0.0/sdk/camera/
- expo-image-picker: https://docs.expo.dev/versions/v58.0.0/sdk/imagepicker/
- expo/fetch: https://docs.expo.dev/versions/v58.0.0/sdk/expo/#expofetch-api
- XMLHttpRequest: https://reactnative.dev/docs/network
- axios: https://github.com/axios/axios 

## Onde a IA errou

| Pedido | O que veio | Como percebi | O certo |
| --- | --- | --- | --- |
| [pedido] | [o que veio] | [como percebi] | [o certo] |

## Resultado e próximos passos no TCC

[resultado e próximos passos]
