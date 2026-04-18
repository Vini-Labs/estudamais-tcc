from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from key import API_KEY  # sua chave OpenAI
import json

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=API_KEY)

@app.route("/")
def home():
    return "API funcionando. Acesse /respostaDousuario para gerar cronogramas."

@app.route("/respostaDousuario", methods=["POST"])
def respostaDousuario():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"erro": "Nenhum dado recebido"}), 400

        horarioInicio = data.get("horarioInicio", "")
        horarioFim = data.get("horarioFim", "")
        materias = data.get("materias", [])

        # Validação mínima
        if not materias or not horarioInicio or not horarioFim:
            return jsonify({"erro": "Dados incompletos para gerar cronograma"}), 400

        print("Payload recebido:", data)

        # Normaliza matérias
        materias_payload = []
        for m in materias:
            if isinstance(m, dict):
                materias_payload.append({
                    "nome": m.get("nome", "Sem nome"),
                    "descricao": m.get("descricao", "").strip() or "Sem descrição",
                    "horario": m.get("horario", ""),
                    "prioridade": m.get("prioridade", "Média"),
                })
            else:
                materias_payload.append({
                    "nome": str(m),
                    "descricao": "Sem descrição",
                    "horario": "",
                    "prioridade": "Média",
                })

        # Prompt estruturado
        messages = [
            {
                "role": "user",
                "content": f"""
Você é um assistente que cria cronogramas de estudo semanais organizados.
Use os dados abaixo:

- matérias: {materias_payload}
- horários de estudo: {horarioInicio} até {horarioFim}

Regras obrigatórias:
1. Distribua as matérias igualmente entre os dias da semana (sem concentrar tudo em um só dia).
2. Ordene sempre as matérias pelo horário (do mais cedo para o mais tarde).
3. Nunca coloque duas matérias no mesmo horário.
4. Máximo de 3 matérias por dia.
5. Sempre preencha a descrição de forma clara (ex: "exercícios de geometria", "mapas climáticos").
6. Não pule horários: respeite a sequência de tempo disponível.
7. O cronograma deve ser coerente e plausível, sem horários ou matérias fora de ordem.

Formato final:
[
  {{
    "dia": "Segunda-feira",
    "materias": [
      {{ "nome": "Matemática", "descricao": "equações de 2º grau", "horario": "09:00 até 10:00" }},
      {{ "nome": "História", "descricao": "Era Moderna", "horario": "10:15 até 11:15" }}
    ]
  }}
]

⚠️ Retorne apenas JSON válido, sem texto extra.
"""
            }
        ]

        completion = client.chat.completions.create(
            model="gpt-5",
            messages=messages
        )

        resposta = completion.choices[0].message.content

        try:
            resposta_json = json.loads(resposta)
        except json.JSONDecodeError as e:
            print("Erro ao converter JSON:", e)
            print("Resposta recebida do GPT:", resposta)
            return jsonify({"erro": "Resposta do GPT inválida", "conteudo": resposta}), 500

        # Garantir que toda matéria tenha descricao
        for dia in resposta_json:
            if "materias" in dia and isinstance(dia["materias"], list):
                for m in dia["materias"]:
                    if "descricao" not in m or not m["descricao"].strip():
                        m["descricao"] = "Sem descrição"

        return jsonify({"respostaDousuario": resposta_json})

    except Exception as e:
        print("Erro interno do servidor:", e)
        return jsonify({"erro": "Erro interno do servidor", "detalhes": str(e)}), 500
    
app.route("/SSA1", methods=["POST"])
def SSA1():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"erro": "Nenhum dado recebido"}), 400

        horarioInicio = data.get("horarioInicio", "")
        horarioFim = data.get("horarioFim", "")
        materias = data.get("materias", [])

        # Validação mínima
        if not materias or not horarioInicio or not horarioFim:
            return jsonify({"erro": "Dados incompletos para gerar cronograma"}), 400

        print("Payload recebido:", data)

        # Normaliza matérias
        materias_payload = []
        for m in materias:
            if isinstance(m, dict):
                materias_payload.append({
                    "nome": m.get("nome", "Sem nome"),
                    "descricao": m.get("descricao", "").strip() or "Sem descrição",
                    "horario": m.get("horario", ""),
                    "prioridade": m.get("prioridade", "Média"),
                })
            else:
                materias_payload.append({
                    "nome": str(m),
                    "descricao": "Sem descrição",
                    "horario": "",
                    "prioridade": "Média",
                })

        # Prompt estruturado
        messages = [
            {
                "role": "user",
                "content": f"""
Você é um assistente que cria cronogramas de estudo semanais organizados.
Use os dados abaixo:

- matérias: {materias_payload}
- horários de estudo: {horarioInicio} até {horarioFim}

Regras obrigatórias:
1. Distribua as matérias igualmente entre os dias da semana (sem concentrar tudo em um só dia).
2. Ordene sempre as matérias pelo horário (do mais cedo para o mais tarde).
3. Nunca coloque duas matérias no mesmo horário.
4. Máximo de 3 matérias por dia.
5. Sempre preencha a descrição de forma clara (ex: "exercícios de geometria", "mapas climáticos").
6. Não pule horários: respeite a sequência de tempo disponível.
7. O cronograma deve ser coerente e plausível, sem horários ou matérias fora de ordem.

Formato final:
[
  {{
    "dia": "Segunda-feira",
    "materias": [
      {{ "nome": "Matemática", "descricao": "equações de 2º grau", "horario": "09:00 até 10:00" }},
      {{ "nome": "História", "descricao": "Era Moderna", "horario": "10:15 até 11:15" }}
    ]
  }}
]

⚠️ Retorne apenas JSON válido, sem texto extra.
"""
            }
        ]

        completion = client.chat.completions.create(
            model="gpt-5",
            messages=messages
        )

        resposta = completion.choices[0].message.content

        try:
            resposta_json = json.loads(resposta)
        except json.JSONDecodeError as e:
            print("Erro ao converter JSON:", e)
            print("Resposta recebida do GPT:", resposta)
            return jsonify({"erro": "Resposta do GPT inválida", "conteudo": resposta}), 500

        # Garantir que toda matéria tenha descricao
        for dia in resposta_json:
            if "materias" in dia and isinstance(dia["materias"], list):
                for m in dia["materias"]:
                    if "descricao" not in m or not m["descricao"].strip():
                        m["descricao"] = "Sem descrição"

        return jsonify({"SSA1": resposta_json})

    except Exception as e:
        print("Erro interno do servidor:", e)
        return jsonify({"erro": "Erro interno do servidor", "detalhes": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)