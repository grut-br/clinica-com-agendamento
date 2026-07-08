export interface ExamContent {
  title: string;
  description: string;
  preparationSteps: string[];
  resultsTime: string;
}

export const examsContent: Record<string, ExamContent> = {
  "ultrassonografia": {
    title: "Ultrassonografia Geral",
    description: "Exame de imagem não invasivo utilizado para visualizar órgãos internos e estruturas corporais em tempo real.",
    preparationSteps: [
      "Jejum absoluto de 8 horas (evitar água, café e alimentos)",
      "Beber de 4 a 6 copos de água 1 hora antes do exame",
      "Não urinar antes do exame (manter a bexiga cheia)",
      "Evitar alimentos produtores de gases nas 24 horas anteriores"
    ],
    resultsTime: "Laudo entregue na hora"
  },
  "ultrassonografia-abdominal": {
    title: "Ultrassonografia Abdominal",
    description: "Avaliação detalhada dos órgãos da cavidade abdominal, como fígado, vesícula biliar, rins e pâncreas.",
    preparationSteps: [
      "Jejum absoluto de 8 horas (evitar água, café e alimentos)",
      "Beber de 4 a 6 copos de água 1 hora antes do exame",
      "Não urinar antes do exame (manter a bexiga cheia)",
      "Tomar medicamento antigases (conforme orientação médica) na véspera"
    ],
    resultsTime: "Laudo entregue na hora"
  },
  "eletrocardiograma": {
    title: "Eletrocardiograma (ECG)",
    description: "Avaliação da atividade elétrica do coração em repouso, identificando arritmias e bloqueios.",
    preparationSteps: [
      "Comparecer com a pele limpa, sem cremes, hidratantes ou óleos",
      "Para homens, pode ser necessária a tricotomia (depilação) no tórax",
      "Evitar praticar exercícios físicos intensos antes do exame",
      "Não fumar ou consumir cafeína nas 2 horas anteriores"
    ],
    resultsTime: "Laudo em até 24 horas"
  },
  "holter-24h": {
    title: "Holter 24 horas",
    description: "Monitoramento contínuo dos batimentos cardíacos durante um dia inteiro para flagrar arritmias intermitentes.",
    preparationSteps: [
      "Tomar banho logo antes do exame (não poderá molhar o aparelho)",
      "Não usar cremes, pomadas ou loções no tórax",
      "Comparecer com camisa folgada com botões frontais",
      "Anotar as atividades e sintomas no diário de bordo fornecido"
    ],
    resultsTime: "Laudo em até 48 horas"
  },
  "espirometria": {
    title: "Espirometria (Exame de Sopro)",
    description: "Medição da capacidade pulmonar, essencial para diagnosticar asma, DPOC e outras condições respiratórias.",
    preparationSteps: [
      "Não utilizar broncodilatadores (bombinhas) de 4 a 12 horas antes (conforme instrução médica)",
      "Não consumir bebidas alcoólicas ou cafeína nas 4 horas anteriores",
      "Não fumar nas 2 horas que antecedem o exame",
      "Evitar refeições pesadas antes do procedimento"
    ],
    resultsTime: "Laudo em até 24 horas"
  },
  "hemograma-completo": {
    title: "Hemograma Completo",
    description: "Análise quantitativa e qualitativa das células do sangue (glóbulos vermelhos, brancos e plaquetas).",
    preparationSteps: [
      "Jejum recomendado de 3 horas (não obrigatório, mas preferível)",
      "Evitar o consumo de bebidas alcoólicas nas 72 horas anteriores",
      "Evitar exercícios físicos intensos no dia anterior",
      "Informar o uso de medicamentos contínuos na recepção"
    ],
    resultsTime: "Resultado em até 12 horas"
  },
  "glicemia-em-jejum": {
    title: "Glicemia em Jejum",
    description: "Medição dos níveis de glicose no sangue para diagnóstico e controle do diabetes.",
    preparationSteps: [
      "Jejum obrigatório de 8 a 12 horas (apenas água é permitida em pequenas quantidades)",
      "Não ultrapassar 14 horas de jejum",
      "Evitar o consumo de bebidas alcoólicas nas 72 horas anteriores",
      "Manter a dieta habitual nos dias anteriores ao teste"
    ],
    resultsTime: "Resultado em até 12 horas"
  },
  "colesterol-e-triglicerideos": {
    title: "Perfil Lipídico (Colesterol & Triglicerídeos)",
    description: "Dosagem das frações de colesterol (HDL, LDL, VLDL) e triglicerídeos no sangue para avaliação cardiovascular.",
    preparationSteps: [
      "Jejum de 8 a 12 horas (de acordo com a última recomendação médica)",
      "Evitar o consumo de álcool nas 72 horas anteriores ao exame",
      "Evitar alterações bruscas na dieta alimentar na semana anterior",
      "Manter repouso físico antes da coleta de sangue"
    ],
    resultsTime: "Resultado em até 12 horas"
  },
  "exame-de-urina": {
    title: "Exame de Urina Tipo 1 (EAS)",
    description: "Análise física, química e microscópica da urina para triagem de infecções urinárias e função renal.",
    preparationSteps: [
      "Coletar preferencialmente a primeira urina da manhã",
      "Realizar a higiene íntima rigorosa com água e sabão antes da coleta",
      "Desprezar o primeiro jato de urina e coletar o jato médio",
      "Entregar o frasco coletor no laboratório em até 2 horas"
    ],
    resultsTime: "Resultado em até 12 horas"
  },
  "exame-de-fezes": {
    title: "Exame Parasitológico de Fezes (EPF)",
    description: "Pesquisa de parasitas, larvas ou ovos no trato digestório para triagem de infecções intestinais.",
    preparationSteps: [
      "Coletar amostra de fezes em frasco limpo e apropriado",
      "Evitar contaminação da amostra com urina ou água do vaso sanitário",
      "Se solicitado em 3 amostras, coletar em dias alternados",
      "Conservar em local fresco e entregar em até 12 horas"
    ],
    resultsTime: "Resultado em até 24 horas"
  },
  "raio-x": {
    title: "Radiografia Geral (Raio-X)",
    description: "Exame de imagem rápido que utiliza radiação de baixa dose para avaliar ossos e pulmões.",
    preparationSteps: [
      "Não requer jejum ou preparo especial na maioria dos casos",
      "Retirar adornos de metal (brincos, correntes, piercings) da área a ser examinada",
      "Usar roupas fáceis de tirar se for necessário vestir o avental clínico",
      "Mulheres devem informar suspeita ou confirmação de gravidez"
    ],
    resultsTime: "Laudo em até 24 horas"
  },
  "mamografia": {
    title: "Mamografia Digital",
    description: "Radiografia de alta resolução das mamas, essencial para a prevenção e diagnóstico precoce do câncer de mama.",
    preparationSteps: [
      "Não usar desodorante, talco, perfume ou cremes nas mamas e axilas no dia do exame",
      "Agendar preferencialmente na semana após a menstruação (mamas menos sensíveis)",
      "Levar exames de mamografia anteriores para comparação de imagens",
      "Vestir blusa de duas peças para facilitar a troca de roupa"
    ],
    resultsTime: "Laudo em até 3 dias úteis"
  },
  "preventivo-papanicolau": {
    title: "Preventivo (Papanicolau)",
    description: "Exame ginecológico de triagem para prevenção do câncer do colo do útero e infecções associadas.",
    preparationSteps: [
      "Não estar menstruada no dia da coleta do exame",
      "Evitar relações sexuais nas 48 horas anteriores ao exame",
      "Não usar duchas vaginais, cremes, pomadas ou lubrificantes nas 48 horas anteriores",
      "Realizar a higiene íntima externa normal apenas com água"
    ],
    resultsTime: "Resultado em até 7 dias úteis"
  },
  "toxico-logico": {
    title: "Exame Toxicológico de Larga Janela",
    description: "Exame laboratorial obrigatório para emissão/renovação de CNH (categorias C, D e E) e concursos públicos.",
    preparationSteps: [
      "Não requer jejum alimentar ou preparo biológico especial",
      "Cabelos ou pelos corporais devem ter no mínimo 3 cm de comprimento para a coleta",
      "Não usar cabelos úmidos ou com produtos finalizadores pesados (gel/laquê)",
      "Levar documento de identificação oficial com foto"
    ],
    resultsTime: "Laudo em até 5 dias úteis"
  }
};
