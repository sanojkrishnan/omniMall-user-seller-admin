export default function Section({ step, title, children }) {
  return (
    <section className="rounded-2xl border border-black/15 bg-white p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-3 text-lg font-bold">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-black text-xs text-white">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
