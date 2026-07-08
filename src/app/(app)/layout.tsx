import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { WhiteLabelInjector } from "@/components/layout/WhiteLabelInjector";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      <WhiteLabelInjector />
      {/* Barra Lateral de Navegação (escondida em mobile, visível em md+) */}
      <Sidebar />

      {/* Conteúdo Principal (Topbar + Área Útil) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Barra Superior */}
        <Topbar />

        {/* Área de Visualização Principal */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background transition-colors duration-300">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
