# Redesign da Experiência de Agendamento do Paciente (Sprint 5)

## Estratégia Adotada
A principal meta foi reduzir a fricção na jornada do paciente. Quando um paciente acessa a página de agendamento de uma clínica, ele pode estar ansioso ou com dor. Qualquer confusão na interface pode causar desistência (churn) ou chamadas de suporte desnecessárias para a recepção.

Para resolver isso, adotamos uma abordagem guiada visualmente, ocultando informações que não são úteis no momento exato e trazendo clareza para o que precisa ser preenchido.

## Melhorias Implementadas

### 1. Stepper Visual Inteligente
A indicação textual de passos (`Etapa 1 de 3`) foi substituída por um componente visual (`Especialidade -> Horário -> Dados -> Confirmação`). Essa barra superior dá previsibilidade e ancora o paciente, comunicando sutilmente que o processo é curto e seguro.

### 2. Otimização do Hero
A seção superior (`Hero`) possuía um grande bloco escuro e pesado visualmente com textos longos. Foi substituída por um cabeçalho curto, limpo e direto, trazendo o formulário interativo "para cima da dobra" do navegador, com foco imediato em conversão.

### 3. Hierarquia da Grade de Horários
A escolha do horário recebeu as seguintes melhorias premium:
- Agrupamento visual dos dias da semana.
- Horários apresentados em cards com uma tipografia forte (`font-heading`).
- Apenas botões de horários disponíveis são mostrados por padrão para não gerar ansiedade.
- Adoção de estados visuais (`hover:bg-accent/5`, focus) guiados pelas regras de Micro-Acessibilidade e navegação por teclado.

### 4. Layout do Formulário de Dados
Os campos agora são estruturados logicamente, utilizando o princípio do "Agrupamento". 
- Um cartão flutuante constante (`Sua Reserva: [Data] às [Horário] com [Profissional]`) reafirma a decisão tomada no passo anterior, mantendo a percepção de continuidade.
- Inputs possuem ícones orientativos (`UserRound`, `Phone`, `CalendarDays`) ajudando o cérebro a reconhecer o formato desejado antes mesmo da leitura.
- O botão final transmite status ativo (Loading com spinner animado) via botão unificado e focado.

### 5. Microcopy e Confirmação
O tom dos textos foi alterado de "técnico" para "humano e profissional".
Na tela de confirmação, informações ambíguas foram removidas e a instrução clara foi fixada: *"O horário escolhido permanece reservado. A recepção entrará em contato em breve via WhatsApp..."*.

## Decisões Técnicas
- **Não** alteração das Server Actions (`bookPublicAppointmentAction`, `fetchPublicAvailableSlotsAction`) para preservar a estabilidade da infraestrutura testada na Sprint anterior.
- Utilização de `Skeleton` no estado de carregamento de horários para mitigar saltos repentinos no layout (Cumulative Layout Shift) e estabilizar a pontuação no Core Web Vitals.

## Componentes Utilizados
- `Lucide Icons` para orientação contextual de passos e labels.
- Estilização nativa Tailwind via prefixos dos tokens do *Design System* (`bg-surface`, `text-foreground`, `border-border`, `text-accent`).
- Formulários padrão HTML5 aprimorados via classes (`appearance-none` combinados com wrappers de ícone absoluto e padding dinâmico).
- `Fade` (from `@/components/motion/presets`) encapsulando cada etapa para transições sem quebras bruscas.

## Problemas Encontrados e Contornos
- Como o sistema inicial não dividia estritamente a escolha da *Especialidade* e o *Horário* no backend (ambos eram consolidados no `step 1`), nós criamos o conceito de `visualStep` isolado do fluxo de submissão do formulário. Isso permitiu o Stepper de 4 passos na UI, enquanto a lógica interna ainda opera perfeitamente com os 2 estados originais do `SchedulingForm`, garantindo estabilidade e fluidez.
