import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Modal,
  TextInput,
} from "react-native";
import { CronogramaContext, CronogramaKey, Materia } from "../../../context/CronogramaContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../../config/firebaseConfig";

const diasSemana = ["Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5", "Semana 6", "Semana 7"];

export default function SuaAgenda() {
  const {
    cronogramas,
    cronogramaSelecionado,
    setCronogramaSelecionado,
    atualizarMateria
  } = useContext(CronogramaContext);

  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [modalVisivel, setModalVisivel] = useState(false);
  const [itemEditando, setItemEditando] = useState<{
    materia: Materia;
    dia: string;
    index: number;
  } | null>(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [horario, setHorario] = useState("");
  const [prioridade, setPrioridade] = useState<"Alta" | "Média" | "Baixa">("Média");

  const router = useRouter();
  const cronogramaAtualRaw = cronogramas[cronogramaSelecionado];

  const cronogramaNormalizado = useMemo(() => {
    if (!Array.isArray(cronogramaAtualRaw)) return [];
    return cronogramaAtualRaw.map((diaRaw, idx) => {
      if (!diaRaw || !Array.isArray(diaRaw.materias))
        return { dia: diasSemana[idx] || `Dia ${idx+1}`, materias: [] };

      const materiasValidas = diaRaw.materias.map((m) => ({
        nome: m.nome,
        descricao: m.descricao || "Sem descrição",
        horario: m.horario || "Sem horário",
        prioridade: m.prioridade || "Média",
      }));

      return { dia: diaRaw.dia || diasSemana[idx], materias: materiasValidas };
    });
  }, [cronogramaAtualRaw]);

  useEffect(() => {
    const user = auth.currentUser;
    setNomeUsuario(user?.displayName || "Usuário");
  }, []);

  const abrirEdicao = (materia: Materia, dia: string, index: number) => {
    setItemEditando({ materia, dia, index });
    setNome(materia.nome);
    setDescricao(materia.descricao);
    setHorario(materia.horario);
    setPrioridade(materia.prioridade || "Média");
    setModalVisivel(true);
  };

  const salvarEdicao = () => {
    if (itemEditando) {
      atualizarMateria(cronogramaSelecionado, itemEditando.dia, itemEditando.index, {
        nome,
        descricao: descricao.trim() !== "" ? descricao : "Sem descrição",
        horario,
        prioridade,
      });
    }
    setModalVisivel(false);
  };

  const corPrioridade = (p: string) => {
    switch(p) {
      case "Alta": return "#FF4D4D";
      case "Média": return "#FFD700";
      case "Baixa": return "#4CAF50";
      default: return "#FFD700";
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/agenda2.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.voltarBotao}>
            <Text style={styles.voltarTexto}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextos}>
            <Text style={styles.userName}>Olá {nomeUsuario} 👋</Text>
            <Text style={styles.subTitulo}>Cronograma: {cronogramaSelecionado}</Text>
          </View>
        </View>

        <View style={styles.listaCategorias}>
          {["ENEM", "SSA1", "SSA2", "SSA3", "Avaliação Escolar"].map(item => (
            <TouchableOpacity key={item} onPress={() => setCronogramaSelecionado(item as CronogramaKey)}>
              <Text style={[styles.categoriaTexto, cronogramaSelecionado === item && styles.categoriaSelecionada]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {cronogramaNormalizado.length === 0 ? (
            <Text style={styles.semConteudoTextoDestacado}>Nenhum cronograma cadastrado ainda.</Text>
          ) : (
            cronogramaNormalizado.map((dia, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.cardTituloMaior}>{dia.dia}</Text>
                {dia.materias.map((m, i) => (
                  <View key={i} style={styles.materia}>
                    <Text style={styles.cardInfo}>{m.nome}</Text>
                    <Text style={styles.cardInfo}>{m.descricao}</Text>
                    <Text style={styles.cardInfo}>🕑 {m.horario}</Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(21,76,76,0.6)" },
  safeArea: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", padding: 16 },
  voltarBotao: { paddingRight: 10 },
  voltarTexto: { fontSize: 28, color: "white", fontWeight: "bold" },
  headerTextos: { flex: 1 },
  userName: { fontSize: 22, fontWeight: "bold", color: "white" },
  subTitulo: { fontSize: 18, color: "white" },
  listaCategorias: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginHorizontal: 16, marginBottom: 8 },
  categoriaTexto: { fontSize: 14, color: "white", backgroundColor: "#143230", padding: 6, borderRadius: 6 },
  categoriaSelecionada: { backgroundColor: "#21A39B" },
  scroll: { padding: 16 },
  card: { marginBottom: 16, backgroundColor: "#0E403D", padding: 14, borderRadius: 12, borderColor: "#21A39B", borderWidth: 1 },
  cardTituloMaior: { fontSize: 20, color: "#FFF", fontWeight: "bold" },
  cardInfo: { fontSize: 16, color: "#FFF" },
  materia: { marginTop: 10 },
  semConteudoTextoDestacado: { color: "#FFF", fontSize: 16, textAlign: "center", marginTop: 50 },
});
