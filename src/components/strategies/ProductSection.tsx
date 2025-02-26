
interface ProductSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ProductSection({ title, children }: ProductSectionProps) {
  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

