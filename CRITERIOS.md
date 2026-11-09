# Critérios de aceitação: primeira versão

- [o] Ao tocar em Escolher imagem, a galeria abre; 
- [o] Ao selecionar uma foto, a miniatura deve aparecer na tela;
- [o] Com uma imagem selecionada o botão Analisar, antes desabilitado, fica habilitado.
 

Verificado em: ( ) aparelho físico (x) emulador

Resultado: (x) passou ( ) reprovou

# Critérios de aceitação: Remodelagem do front-end e conexão com a API do Xiz9
- [o] Ao tocar num botão "Remover a imagem" deve remover a imagem selecionada e bloquear novamente o botão "Analisar"
- [o] Ao clicar em "Analisar" deve enviar a imagem selecionada para a API do Xiz9;
- [o] Ao receber o retorno da requisição deve informar o resultado obtido da API;
- [x] Caso não consiga conectar na API do Xiz9 deve mostrar uma mensagem de erro mostrando a mensagem de erro recebida

Verificado em: ( ) aparelho físico (x) emulador

Resultado: () passou (x) reprovou

# Critérios de aceitação
- [o] Caso falhe a requisição a API do Xiz9 por falhar na requisição é para falar "Não foi possivel se comunicar com o serviço do Xiz9
- [o] Em todos os casos de falhar a requisição de analise, jamais deve mostrar a url de acesso da API;

Verificado em: ( ) aparelho físico (x) emulador

Resultado: (x) passou ( ) reprovou
