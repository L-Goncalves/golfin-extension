# GolfIn - Extensão para melhorar sua experiência no LinkedIn

GolfIn é uma extensão para aprimorar sua experiência no LinkedIn — seja para buscar empregos, navegar no site ou fazer conexões.

# Comunidade

**“Golfin não tem nenhum produto pago e não oferece nenhuma assinatura. Qualquer pessoa usando Golfin para promover qualquer coisa é um golpe.”**

### 🌟 Funcionalidades

#### 👉 Feed

* ✅ Remover postagens com base em palavras-chave.
* ✅ Remover o feed (ideal para quem quer mais foco e produtividade).

#### 👉 Vagas

* ✅ Remover vagas de determinados **domínios** (configurável por lista).
* ✅ Remover vagas de **empresas** específicas (configurável por lista).
* ✅ Ocultar vagas em que você já se candidatou usando **Easy Apply**.
* ✅ Exibir **URL completa** e **ícones** nas vagas.
* ✅ Salvar pesquisas durante a busca por vagas.
* ✅ Remover vagas com selo **“promovido”**.

#### 👉 Minha rede

* ✅ Aceitar **conexões automaticamente**.

---

## 🚀 Como começar

1️⃣ Instale as dependências e inicie o servidor de desenvolvimento:

```bash
pnpm dev
# ou
npm run dev
```

2️⃣ No navegador, carregue o build de desenvolvimento.
Exemplo: para Chrome usando manifest v3, use `build\chrome-mv3-dev`. e carregue "sem compactação", selecione a pasta e fica pronto pra começar a desenvolver algo.

3️⃣ Edite o arquivo `popup.tsx` para personalizar o popup — ele será recarregado automaticamente.

* Para adicionar uma página de opções → crie `options.tsx` no root do projeto.
* Para adicionar um content script → crie `content.ts` no root e adicione sua lógica.

📖 Documentação completa do Plasmo: [Plasmo Docs](https://docs.plasmo.com/)

---

## 📦 Build de produção e empacotamento

```bash
pnpm build && pnpm package
# ou
npm run build && pnpm package
```
