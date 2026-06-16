import type { ReactNode } from "react";

export function PageHero({
  title,
  subtitle,
  image,
}: {
  title: ReactNode;
  subtitle?: string;
  image: string;
}) {
  return (
    <section className="relative flex h-[44vh] min-h-[320px] items-end overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(45,45,45,0.85), rgba(45,45,45,0.45))" }}
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-12">
        <h1 className="font-serif text-4xl text-white md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-xl text-white/85">{subtitle}</p>}
      </div>
    </section>
  );
}
