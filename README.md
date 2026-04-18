# 📚 Estuda+ — Sistema Inteligente de Cronogramas Escolares

Aplicativo mobile inteligente que gera cronogramas de estudo personalizados para
candidatos ao **ENEM** e **SSA**, com base em áreas de estudo, matérias,
grau de dificuldade e horários disponíveis do usuário.

---

## 👥 Equipe

| Membro | Papel |
|---|---|
| Vinícius Gabriel | Scrum Master |
| Eduardo Severino | Product Owner |
| Cássio Sidny | Developer |
| Pedro Henrique | Developer |
| Guilherme Lopes | Developer |

---

## 🚀 Tecnologias

- **Mobile:** React Native + Expo
- **Linguagens:** JavaScript / TypeScript / Python
- **Banco de Dados:** MySQL
- **Backend/API:** Python (`main.py`)
- **Integração:** Firebase

---

## ⚙️ Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [Expo CLI](https://docs.expo.dev/get-started/installation/) instalado
- [Python 3.x](https://www.python.org/) instalado
- MySQL configurado e rodando
- Aplicativo **Expo Go** no celular (ou emulador)

### Instalação

```bash
git clone https://github.com/seu-usuario/estuda-mais.git
cd estuda-mais
npm install
```

### Configuração do Banco de Dados

Abra o arquivo `BD.py` e substitua as credenciais pelo seu ambiente MySQL:

```python
connection = mysql.connector.connect(
    host="SEU_HOST",
    user="SEU_USUARIO",
    password="SUA_SENHA",
    database="SEU_BANCO"
)
```

### Configuração das variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env` com suas chaves (Firebase, API key, etc).

### Rodando o backend (API Python)

```bash
cd backend   # ou o caminho onde está o main.py
pip install -r requirements.txt
python main.py
```

### Rodando o app

```bash
npx expo start
```

Escaneie o QR code com o **Expo Go** no celular.

---

## 📱 Funcionalidades

- Seleção de modalidade de prova: **ENEM** ou **SSA**
- Escolha de **áreas de estudo** e **matérias**
- Definição do **grau de dificuldade** por matéria
- Configuração de **horários disponíveis** para estudo
- Geração automática de cronograma personalizado via IA
- API busca os dados no banco e retorna em **JSON** para o frontend

---

## 🔐 Segurança

Credenciais do Firebase, chaves de API e dados de conexão com o banco
**não estão** no repositório. Consulte `.env.example` e as instruções
de configuração do `BD.py` acima.

---

## 📄 Licença

MIT