type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow = "Workspace", title, description }: PageHeaderProps) {
  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
        {eyebrow}
      </p>
      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold text-ink md:text-4xl">{title}</h2>
        <p className="mt-3 text-base leading-7 text-muted md:text-lg">{description}</p>
      </div>
    </section>
  );
}
