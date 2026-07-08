export interface SpecialtyContent {
  title: string;
  heroDescription: string;
  servicesTitle: string;
  services: string[];
  doctor: {
    name: string;
    role: string;
    description: string;
  };
}

export const specialtiesContent: Record<string, SpecialtyContent> = {
  // --- Especialidades Originais ---
  cardiologia: {
    title: "Cardiologia",
    heroDescription: "Saúde de qualidade ao seu alcance. Cuidado completo e prevenção para o seu coração.",
    servicesTitle: "Procedimentos e Avaliações",
    services: [
      "Avaliação e Perícia Médica (INSS e Benefícios)",
      "Consulta Cardiológica",
      "Angiologia e Pneumologia",
      "Acompanhamento de Diabetes e Nefrologia",
      "Eletrocardiograma e Espirometria",
      "Avaliação de Risco Cirúrgico"
    ],
    doctor: {
      name: "Dr. Fernando Lima",
      role: "Cardiologista",
      description: "Especialista com ampla experiência em avaliações clínicas e exames cardiológicos de alta precisão."
    }
  },
  odontologia: {
    title: "Odontologia Clínica & Estética",
    heroDescription: "Cuidado completo e preventivo para a saúde bucal de toda a sua família. Tratamentos modernos com tecnologia avançada.",
    servicesTitle: "Procedimentos e Tratamentos",
    services: [
      "Limpeza profilática e remoção de tártaro",
      "Restaurações estéticas em resina",
      "Tratamento de canal (Endodontia)",
      "Extrações dentárias simples e de siso",
      "Clareamento dental a laser e caseiro",
      "Facetas e lentes de contato dentais"
    ],
    doctor: {
      name: "Dr. Arthur Lima",
      role: "Cirurgião-Dentista & Estética",
      description: "Especialista em reabilitação oral e procedimentos de estética dental avançada."
    }
  },
  ortodontia: {
    title: "Ortodontia",
    heroDescription: "Correção e alinhamento dos dentes para devolver a harmonia estética e funcional da sua arcada.",
    servicesTitle: "Tratamentos Ortodônticos",
    services: [
      "Instalação de aparelho fixo metálico e cerâmico",
      "Ortodontia preventiva para crianças",
      "Alinhadores invisíveis de alta tecnologia",
      "Aparelhos ortopédicos funcionais",
      "Manutenção e acompanhamento ortodôntico contínuo"
    ],
    doctor: {
      name: "Dr. Arthur Lima",
      role: "Ortodontista",
      description: "Especialista em ortodontia corretiva e alinhadores invisíveis estéticos."
    }
  },
  "ginecologia-integrativa": {
    title: "Ginecologia Integrativa",
    heroDescription: "Saúde e bem-estar feminino sob um olhar holístico. Equilíbrio metabólico e preventivo completo.",
    servicesTitle: "Procedimentos e Acompanhamento",
    services: [
      "Consulta ginecológica de rotina e preventiva (Papanicolau)",
      "Planejamento familiar e inserção de DIU/implantes contraceptivos",
      "Acompanhamento da menopausa e climatério integrativo",
      "Tratamento da endometriose e síndrome dos ovários policísticos (SOP)",
      "Modulação hormonal bioidêntica e exames preventivos"
    ],
    doctor: {
      name: "Dra. Camila Soares",
      role: "Ginecologista e Obstetra",
      description: "Especialista focada no cuidado integral da saúde feminina e longevidade saudável."
    }
  },
  gastroenterologia: {
    title: "Gastroenterologia",
    heroDescription: "Prevenção, diagnóstico e tratamento de distúrbios que afetam o aparelho digestório.",
    servicesTitle: "Tratamentos Digestivos",
    services: [
      "Tratamento de refluxo gastroesofágico e gastrites",
      "Acompanhamento da Síndrome do Intestino Irritável (SII)",
      "Tratamento de intolerâncias e alergias alimentares",
      "Prevenção e controle de esteatose hepática (gordura no fígado)",
      "Diagnóstico e triagem de exames de endoscopia e colonoscopia"
    ],
    doctor: {
      name: "Dr. Ricardo Ramos",
      role: "Gastroenterologista",
      description: "Especialista focado em microbiota intestinal, distúrbios digestivos e bem-estar metabólico."
    }
  },
  psicologia: {
    title: "Psicologia & Psicoterapia",
    heroDescription: "Espaço de acolhimento e suporte emocional para promover autoconhecimento e saúde mental.",
    servicesTitle: "Áreas de Atendimento",
    services: [
      "Psicoterapia individual para jovens e adultos",
      "Acompanhamento de transtornos de ansiedade e pânico",
      "Tratamento de depression e burnout ocupacional",
      "Orientação profissional e transição de carreira",
      "Terapia cognitivo-comportamental (TCC)"
    ],
    doctor: {
      name: "Dra. Larissa Mendes",
      role: "Psicóloga Clínica",
      description: "Especialista em psicoterapia cognitivo-comportamental com foco em inteligência emocional."
    }
  },
  nutricao: {
    title: "Nutrição Clínica & Funcional",
    heroDescription: "Reeducação alimentar personalizada com foco na longevidade, performance e qualidade de vida.",
    servicesTitle: "Serviços e Consultas",
    services: [
      "Consulta e avaliação de composição corporal (Bioimpedância)",
      "Planejamento alimentar personalizado focado em emagrecimento",
      "Nutrição esportiva para ganho de massa magra e performance",
      "Nutrição clínica preventiva para diabetes e colesterol",
      "Nutrição funcional com foco em otimização do sistema imunológico"
    ],
    doctor: {
      name: "Dr. Marcos Vinícius",
      role: "Nutricionista Funcional",
      description: "Especialista em planejamento dietético personalizado para esportes e emagrecimento saudável."
    }
  },
  "clinico-geral": {
    title: "Clínica Médica Geral",
    heroDescription: "Atendimento de saúde primário de excelência e acompanhamento médico contínuo e preventivo.",
    servicesTitle: "Procedimentos e Check-ups",
    services: [
      "Consulta geral de check-up de saúde anual",
      "Controle e ajuste de tratamento para hipertensão e diabetes",
      "Avaliação física e laudos de aptidão física gerais",
      "Tratamento e manejo de infecções agudas comuns",
      "Orientação médica preventiva e solicitação de exames"
    ],
    doctor: {
      name: "Dr. Ricardo Ramos",
      role: "Clínico Geral",
      description: "Médico de família focado em medicina preventiva e triagem diagnóstica global."
    }
  },

  // --- Novas Especialidades Cadastradas ---
  pediatria: {
    title: "Pediatria",
    heroDescription: "O cuidado mais carinhoso e completo para o crescimento saudável de quem você mais ama.",
    servicesTitle: "Serviços e Acompanhamentos",
    services: [
      "Puericultura (Acompanhamento do Desenvolvimento)",
      "Consultas de Rotina e Check-ups Infantis",
      "Orientação Alimentar e Introdução Alimentar",
      "Tratamento de Alergias e Infecções Comuns",
      "Vacinação e Atualização de Carteira de Vacina"
    ],
    doctor: {
      name: "Dra. Mariana Costa",
      role: "Pediatra",
      description: "Especialista em desenvolvimento infantil com foco em atendimento lúdico, calmo e humanizado."
    }
  },
  dermatologia: {
    title: "Dermatologia Clínica & Estética",
    heroDescription: "Cuidado especializado para a saúde e beleza da sua pele, unhas e cabelos. Tecnologia a favor do seu bem-estar.",
    servicesTitle: "Tratamentos Dermatológicos",
    services: [
      "Tratamento de Acne, Melasma e Manchas",
      "Prevenção e Diagnóstico de Câncer de Pele",
      "Remoção de Sinais, Verrugas e Lesões",
      "Tratamentos para Queda de Cabelo e Couro Cabeludo",
      "Procedimentos Estéticos Faciais e Corporais"
    ],
    doctor: {
      name: "Dra. Carolina Albuquerque",
      role: "Dermatologista",
      description: "Dedicação completa à saúde integrativa da pele e aplicação de tratamentos de rejuvenescimento natural."
    }
  },
  endocrinologia: {
    title: "Endocrinologia & Metabologia",
    heroDescription: "Equilíbrio hormonal e metabólico para mais vitalidade. Tratamentos focados na sua qualidade de vida.",
    servicesTitle: "Acompanhamento Metabólico",
    services: [
      "Tratamento e Controle de Diabetes",
      "Acompanhamento de Distúrbios da Tireoide",
      "Tratamento de Obesidade e Emagrecimento Saudável",
      "Modulação de Distúrbios Hormonais Femininos e Masculinos",
      "Avaliação de Metabolismo e Tratamento de Fadiga Crônica"
    ],
    doctor: {
      name: "Dra. Camila Soares",
      role: "Endocrinologista",
      description: "Ampla experiência em modulação hormonal e restabelecimento do equilíbrio metabólico corporal."
    }
  },
  ortopedia: {
    title: "Ortopedia & Traumatologia",
    heroDescription: "Restabelecendo sua mobilidade e conforto físico. Cuidado especializado para ossos e articulações.",
    servicesTitle: "Avaliações e Tratamentos",
    services: [
      "Tratamento de Dores Crônicas e Artroses",
      "Acompanhamento de Lesões Esportivas e Musculares",
      "Avaliação Postural e de Coluna Vertebral",
      "Tratamento de Tendinites, Bursites e Fascite Plantar",
      "Prevenção e Controle de Osteoporose"
    ],
    doctor: {
      name: "Dr. Gustavo Neves",
      role: "Ortopedista",
      description: "Especialista em reabilitação física musculoesquelética e ortopedia preventiva de alta performance."
    }
  },
  fonoaudiologia: {
    title: "Fonoaudiologia",
    heroDescription: "Desenvolvendo a comunicação, fala, audição e deglutição em todas as fases da vida com acolhimento profissional.",
    servicesTitle: "Áreas de Atuação",
    services: [
      "Terapia de Fala e Linguagem Infantil",
      "Reabilitação Vocacional e Cuidado com a Voz",
      "Tratamento de Disfagia (Dificuldade de Deglutição)",
      "Treinamento Auditivo e Processamento Auditivo Central",
      "Acompanhamento de Atraso no Desenvolvimento de Linguagem"
    ],
    doctor: {
      name: "Dra. Patrícia Santos",
      role: "Fonoaudióloga",
      description: "Especialista em terapia da comunicação humana com abordagem afetiva, científica e dinâmica."
    }
  },
  fisioterapia: {
    title: "Fisioterapia Integrativa",
    heroDescription: "Alívio de dores, reabilitação física e melhora da qualidade do seu movimento. Viva sem limitações.",
    servicesTitle: "Tratamentos Fisioterapêuticos",
    services: [
      "Fisioterapia Ortopédica e Traumatológica",
      "Reabilitação de Coluna e Correção Postural (RPG)",
      "Fisioterapia para Dores Crônicas e Tendinites",
      "Reabilitação Esportiva e Acompanhamento Pós-Operatório",
      "Fisioterapia Respiratória e Geriatria Preventiva"
    ],
    doctor: {
      name: "Dr. Gustavo Neves",
      role: "Fisioterapeuta",
      description: "Especialista em terapia manual, reeducação mecânica corporal e reabilitação de dor articular."
    }
  },
  nutrologia: {
    title: "Nutrologia & Longevidade",
    heroDescription: "Prevenção e tratamento de doenças através da nutrição médica. Equilíbrio de nutrientes para otimizar sua saúde.",
    servicesTitle: "Procedimentos Nutrológicos",
    services: [
      "Avaliação de Deficiências de Vitaminas e Minerais",
      "Acompanhamento Nutrológico de Obesidade e Sobrepeso",
      "Terapia de Modulação Metabólica e Nutroterapia",
      "Otimização de Performance Física e Emagrecimento Saudável",
      "Prevenção do Envelhecimento Precoce e Suplementação Alimentar"
    ],
    doctor: {
      name: "Dr. Fernando Lima",
      role: "Nutrólogo",
      description: "Médico dedicado ao bem-estar metabólico, equilíbrio metabólico e à medicina preventiva integrada."
    }
  },
  neurologia: {
    title: "Neurologia Clínica",
    heroDescription: "Cuidado especializado para o sistema nervoso. Diagnósticos precisos para mais segurança e qualidade de vida.",
    servicesTitle: "Investigações e Condutas",
    services: [
      "Tratamento de Dores de Cabeça e Enxaquecas Refratárias",
      "Investigação de Distúrbios de Memória, Atenção e Demências",
      "Acompanhamento de Distúrbios do Sono, Insônia e Apneia",
      "Avaliação Preventiva e Pós-Acidente Vascular Cerebral (AVC)",
      "Diagnóstico e Tratamento de Tremores e Doença de Parkinson"
    ],
    doctor: {
      name: "Dr. Ricardo Ramos",
      role: "Neurologista",
      description: "Neurologista clínico com foco no bem-estar cognitivo, prevenção de AVC e manejo de dores neuropáticas."
    }
  },
  "medicina-do-trabalho": {
    title: "Medicina do Trabalho",
    heroDescription: "Saúde ocupacional completa para a sua empresa. Garantia de conformidade, segurança e bem-estar no trabalho.",
    servicesTitle: "Exames Ocupacionais",
    services: [
      "Exame Ocupacional Admissional e Demissional",
      "Exame Periódico e Retorno ao Trabalho pós-afastamento",
      "Emissão de Atestado de Saúde Ocupacional (ASO) no eSocial",
      "Elaboração de Laudos e Programas de Saúde do Trabalhador",
      "Avaliação de Aptidão Física e Mental para Cargos Específicos"
    ],
    doctor: {
      name: "Dr. Fernando Lima",
      role: "Médico do Trabalho",
      description: "Ampla experiência na gestão de saúde ocupacional corporativa e prevenção de riscos laborais."
    }
  },
  angiologia: {
    title: "Angiologia & Saúde Vascular",
    heroDescription: "Cuidado dedicado à saúde das suas veias e artérias. Pernas leves, circulação saudável e prevenção de trombose.",
    servicesTitle: "Tratamentos Vasculares",
    services: [
      "Escleroterapia Química (Aplicação de Vasinhos e Varizes)",
      "Tratamento e Prevenção de Insuficiência Venosa Crônica",
      "Prevenção e Acompanhamento de Trombose Venosa Profunda (TVP)",
      "Avaliação Doppler de Circulação e Inchaços nas Pernas",
      "Tratamento de Úlceras e Feridas de Origem Vascular"
    ],
    doctor: {
      name: "Dra. Carolina Albuquerque",
      role: "Angiologista",
      description: "Especialista em rejuvenescimento vascular, tratamentos não cirúrgicos de varizes e prevenção de trombose."
    }
  },
  estetica: {
    title: "Estética Avançada",
    heroDescription: "Realçando sua beleza natural com procedimentos minimamente invasivos de última geração. Autoestima renovada.",
    servicesTitle: "Procedimentos Estéticos",
    services: [
      "Harmonização Facial e Preenchimento com Ácido Hialurônico",
      "Aplicação de Toxina Botulínica (Botox) para Rugas",
      "Bioestimuladores de Colágeno (Sculptra, Radiesse)",
      "Tratamento de Rugas de Expressão, Flacidez e Cicatrizes",
      "Peelings Químicos e Microagulhamento Facial de Alta Performance"
    ],
    doctor: {
      name: "Dra. Carolina Albuquerque",
      role: "Médica Esteta",
      description: "Especialista em harmonização estética natural com técnicas de rejuvenescimento sutil e refinado."
    }
  }
};
