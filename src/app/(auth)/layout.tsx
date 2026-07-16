export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      
      {/* Plano de fundo premium */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Glow radial superior esquerdo */}
        <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10" />
        {/* Glow radial inferior direito */}
        <div className="absolute -bottom-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-accent/5 blur-[150px] dark:bg-accent/10" />
        
        {/* Grid geométrica sutil */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] bg-[linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Conteúdo do Login */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </div>

    </div>
  );
}
