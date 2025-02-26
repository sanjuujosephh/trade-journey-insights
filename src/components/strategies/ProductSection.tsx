
interface ProductSectionProps {
  title: string;
  children: React.ReactNode;
  columns?: 3 | 4;
}

export function ProductSection({ title, children, columns = 4 }: ProductSectionProps) {
  return (
    <section className="my-[30px]">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className={`grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-${columns}`}>
        {children}
      </div>
    </section>
  );
}
