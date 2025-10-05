export function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-4">
      <div className="max-w-3xl m-auto flex gap-5">{children}</div>
    </section>
  );
}
