import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "Med Odonto | Central Operacional & Agendamento Clínico",
    template: "%s | Med Odonto"
  },
  description: "Plataforma integrada de agendamento de consultas, triagem de recepção e prontuário médico eletrônico para clínicas e consultórios.",
  keywords: ["clínica", "agendamento", "médico", "dentista", "prontuário", "consultório", "saúde bucal", "recepção", "Med Odonto"],
  authors: [{ name: "Med Odonto" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
