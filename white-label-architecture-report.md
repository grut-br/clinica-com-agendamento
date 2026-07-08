# Relatório Técnico: Arquitetura White-Label e Temas

Este documento detalha o estado atual da arquitetura de temas (Modo Claro/Escuro) e injeção White-Label no front-end da aplicação.

## 1. `globals.css` - Fundação Semântica e Blindagem de Tema

Após o expurgo de classes utilitárias fixas, o Tailwind v4 agora mapeia as variáveis injetadas rigorosamente baseadas na estratégia White-Label.

**No Modo Claro (`:root`):**
O `:root` define as variáveis puras, criando a fundação de contraste (Fundo claro, Tipografia escura, Marca azul/dourada).
```css
:root {
  --background: 0 0% 100%; /* Branco puro */
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  
  --primary: 222.2 47.4% 11.2%; /* Azul da Marca */
  --primary-foreground: 210 40% 98%;
  
  --accent: 43 74% 49%; /* Dourado da Marca */
  --accent-foreground: 210 40% 98%;
  
  --border: 240 5.9% 90%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
}
```

**No Modo Escuro (`.dark`):**
O `.dark` forçou a neutralidade absoluta. A cor `--primary` virou um cinza claríssimo (`0 0% 98%`) para manter contraste, blindando os cards contra vazamentos de cor azul. Apenas o `--accent` (ações) é preservado.
```css
.dark {
  --background: 240 10% 3.9%; /* Zinco escuro puro */
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --border: 240 3.7% 15.9%;
  
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  
  --accent: 43 74% 49%; /* Dourado mantido para CTA */
}
```

---

## 2. Componentes de Tabela (Limpeza dos "Zumbis")

Todas as classes engessadas como `bg-white`, `bg-slate-50`, `text-slate-500` e divisores físicos de cor, que quebravam no dark mode, foram substituídas pelos tokens `bg-card`, `bg-muted` e `text-foreground`. Nenhuma chamada física de cor existe mais nas marcações de estrutura da UI.

**Trecho de `specialties-manager.tsx` (Estrutura de Container e Table Header):**
```tsx
{/* Container do Card/Tabela */}
<div className={`bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-card-foreground transition-opacity`}>

{/* Header da Tabela */}
<tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 select-none">
  <th className="px-6 py-4">Nome / Slug</th>
  <th className="px-6 py-4">Categoria</th>
</tr>

{/* Linhas (Rows) */}
<tbody className="divide-y divide-border text-sm">
  <tr className="hover:bg-muted/30 transition-colors">
    <td className="px-6 py-4.5">
      {/* Texto principal e Texto Secundário dinâmicos */}
      <div className="font-bold text-foreground text-sm flex items-center gap-2">...</div>
      <div className="text-2xs text-muted-foreground font-semibold mt-1">...</div>
    </td>
```

---

## 3. Componente de Aparência e Injetor White-Label

O formulário `clinic-settings-form.tsx` agora trabalha integrado a um componente isolado (`WhiteLabelInjector.tsx`), separando o preview visual (no formulário) da aplicação reativa da regra de negócio (no Layout root). 

**Estrutura do Formulário (`clinic-settings-form.tsx`):**
Possui 3 states principais mapeados nos novos inputs de `type="color"`: `primaryColor`, `accentColor`, `backgroundColor`.
Possui um `useEffect` local de **Preview Ao Vivo** no DOM:
```tsx
  // Preview dinâmico em tempo real
  useEffect(() => {
    if (typeof document === "undefined") return;
    // Evita preview corromper o Modo Escuro
    if (document.documentElement.classList.contains("dark")) return;
    
    document.documentElement.style.setProperty("--primary", hexToHslString(primaryColor));
    document.documentElement.style.setProperty("--accent", hexToHslString(accentColor));
    document.documentElement.style.setProperty("--background", hexToHslString(backgroundColor));
    document.documentElement.style.setProperty("--card", hexToHslString(backgroundColor));
  }, [primaryColor, accentColor, backgroundColor]);
```

**O Motor Global (`WhiteLabelInjector.tsx` injetado no `layout.tsx`):**
A injeção usa o hook `useTheme` do `next-themes` para forçar um bloqueio severo contra contaminação no modo dark:
```tsx
export function WhiteLabelInjector() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    if (resolvedTheme === "light") {
      // Injeta apenas no Modo Claro lendo o storage (com cache local)
      const savedPrimary = localStorage.getItem("clinic_primary_color_hsl");
      if (savedPrimary) root.style.setProperty("--primary", savedPrimary);
      /* (replica lógica pro accent e background) */
      
    } else {
      // Blindagem do Modo Escuro: Destrói qualquer CSS inline do White-Label
      root.style.removeProperty("--primary");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--background");
      root.style.removeProperty("--card");
    }
  }, [resolvedTheme]);

  return null;
}
``` 

Esse setup permite que as cores "Branded" (White-Label) do banco de dados flutuem por cima da arquitetura no Modo Claro, sem nunca degradarem a pureza do Modo Escuro.
