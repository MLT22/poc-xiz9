This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Convenções deste projeto
- Não altere arquivos fora do escopo pedido. Explique cada alteração.
- Componentes ficam em `components/`, um arquivo por componente.
- Estado nunca é modificado no lugar: sempre gere um novo valor.
- Valores que podem ser calculados a partir do estado não viram estado.
- Instale dependências sempre com `npx expo install`, nunca com `npm install`.
- Antes de usar um pacote, confirme na documentação se ele funciona no Expo Go.
- Não leia nem edite CRITERIOS.md e PESQUISA.md, a menos que eu peça.

## Contexto desta prova de conceito
- TCC: Xiz9, uma API REST que detecta imagens geradas por IA utilizando uma rede neural (EfficientNet V2S).
- Problema: o Xiz9 foi pensado para plataformas parceiras, mas só foi testado por um site; a PoC é um cliente móvel mínimo que envia uma foto à API e exibe o veredito e a confiança, mesmo com análise lenta e conexão que pode falhar.
- Tecnologia investigada: expo-image-picker e fetch.
- Uma tela só, em `App.tsx`: o usuário escolhe uma foto, toca em Analisar e vê veredito, confiança e camada.
- Não usar Expo Router.
- Fora de escopo: login, design final e tudo que não demonstre a pergunta.

## Funcionamento do Xiz9
- É uma API em python que utiliza o framework fast api.
- Ela rodando localmente na porta 8000.
- Essa API tem apenas um endpoint POST '/Xiz9/analise', no qual recebe um objeto do tipo UploadFile.
- Essa aplicação só aceita arquivos dos tipos: "image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff".
- O endpoint '/Xiz9/analise' devolve um json com dois campos: 1. label: classificação "REAL" ,"IA", ou "INCERTO"; 2. confidence: probabilidade de ser o que foi classificado;
- Na classificação é utilizado um threshold de 75%, no qual se o campo "confidence" for menor do que 75% (0.75) é classificado como "INCERTO".

