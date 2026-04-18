import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Materia = {
  nome: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  grau?: '1° ano' | '2° ano' | '3° ano';
  horario: string;
  descricao: string;
};

export type DiaCronograma = {
  dia: string;
  materias: Materia[];
};

export type CronogramaKey = 'ENEM' | 'SSA1' | 'SSA2' | 'SSA3' | 'Avaliação Escolar';

export type Avaliacao = {
  titulo: string;
  grau?: '1° ano' | '2° ano' | '3° ano';
  data: string;
  nota?: number | null;
  observacoes?: string;
};

type CronogramaContextType = {
  cronogramas: Record<CronogramaKey, DiaCronograma[]>;
  avaliacoes: Avaliacao[];
  cronogramaSelecionado: CronogramaKey;
  setCronogramaSelecionado: (key: CronogramaKey) => void;
  setCronogramas: React.Dispatch<React.SetStateAction<Record<CronogramaKey, DiaCronograma[]>>>;
  setAvaliacoes: React.Dispatch<React.SetStateAction<Avaliacao[]>>;
  atualizarMateria: (
    cronograma: CronogramaKey,
    dia: string,
    materiaIndex: number,
    patch: Partial<Materia>
  ) => void;
  adicionarAvaliacao: (avaliacao: Avaliacao) => void;
};

export const CronogramaContext = createContext<CronogramaContextType>({} as CronogramaContextType);

export const CronogramaProvider = ({ children }: { children: ReactNode }) => {
  const [cronogramaSelecionado, setCronogramaSelecionado] = useState<CronogramaKey>('ENEM');

  const [cronogramas, setCronogramas] = useState<Record<CronogramaKey, DiaCronograma[]>>({
    ENEM: [],
    SSA1: [],
    SSA2: [],
    SSA3: [],
    'Avaliação Escolar': [],
  });

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

  // Atualiza uma matéria específica
  const atualizarMateria: CronogramaContextType['atualizarMateria'] = (
    cronograma,
    dia,
    materiaIndex,
    patch
  ) => {
    setCronogramas(prev => {
      const atualizado = prev[cronograma].map(diaItem => {
        if (diaItem.dia !== dia) return diaItem;
        const novasMaterias = diaItem.materias.map((m, idx) =>
          idx !== materiaIndex ? m : { ...m, ...patch }
        );
        return { ...diaItem, materias: novasMaterias };
      });
      AsyncStorage.setItem('@cronogramas', JSON.stringify({ ...prev, [cronograma]: atualizado })).catch(
        err => console.error('Erro ao salvar cronogramas no AsyncStorage', err)
      );
      return { ...prev, [cronograma]: atualizado };
    });
  };

  // Adiciona avaliação
  const adicionarAvaliacao = (nova: Avaliacao) => {
    setAvaliacoes(prev => {
      const atualizado = [...prev, nova];
      AsyncStorage.setItem('@avaliacoes', JSON.stringify(atualizado)).catch(err =>
        console.error('Erro ao salvar avaliações no AsyncStorage', err)
      );
      return atualizado;
    });
  };

  // 🔹 Converte os dados recebidos do backend
  const transformarDadosAPI = (dados: any[]): DiaCronograma[] => {
    if (!Array.isArray(dados)) return [];

    return dados.map((diaObj: any) => ({
      dia: diaObj.dia || 'Dia indefinido',
      materias: Array.isArray(diaObj.materias)
        ? diaObj.materias.map((m: any) => ({
            nome: m.nome || 'Sem nome',
            descricao: m.descricao || 'Sem descrição',
            horario: m.horario || '00:00 - 00:00',
            prioridade:
              m.prioridade === 'Alta' || m.prioridade === 'Baixa'
                ? m.prioridade
                : 'Média',
          }))
        : [],
    }));
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const storedCronogramas = await AsyncStorage.getItem('@cronogramas');
        const storedAvaliacoes = await AsyncStorage.getItem('@avaliacoes');

        let cronogramasTemp: Record<CronogramaKey, DiaCronograma[]> = {
          ENEM: [],
          SSA1: [],
          SSA2: [],
          SSA3: [],
          'Avaliação Escolar': [],
        };

        if (storedCronogramas) cronogramasTemp = JSON.parse(storedCronogramas);
        if (storedAvaliacoes) setAvaliacoes(JSON.parse(storedAvaliacoes));

        // 🔸 Busca dados do backend
        try {
          const res = await fetch('http://192.168.0.106:5000/respostaDousuario', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.respostaDousuario && Array.isArray(data.respostaDousuario)) {
              const estrutura = transformarDadosAPI(data.respostaDousuario);

              // aplica a todos os cronogramas
              cronogramasTemp.ENEM = estrutura;
              cronogramasTemp.SSA1 = estrutura;
              cronogramasTemp.SSA2 = estrutura;
              cronogramasTemp.SSA3 = estrutura;
              cronogramasTemp['Avaliação Escolar'] = estrutura;
            }
          } else {
            console.warn('⚠️ Falha ao buscar cronograma da API');
          }
        } catch (err) {
          console.warn('Não foi possível atualizar do backend:', err);
        }

        await AsyncStorage.setItem('@cronogramas', JSON.stringify(cronogramasTemp));
        setCronogramas(cronogramasTemp);
      } catch (err) {
        console.error('Erro ao carregar dados do AsyncStorage', err);
      }
    };

    carregarDados();
  }, []);

  return (
    <CronogramaContext.Provider
      value={{
        cronogramas,
        avaliacoes,
        cronogramaSelecionado,
        setCronogramaSelecionado,
        setCronogramas,
        setAvaliacoes,
        atualizarMateria,
        adicionarAvaliacao,
      }}
    >
      {children}
    </CronogramaContext.Provider>
  );
};
