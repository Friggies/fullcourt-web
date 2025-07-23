export function Hero({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-xl lg:text-3xl mx-auto max-w-sm text-center font-semibold">
        {title}
      </h1>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    </div>
  );
}
