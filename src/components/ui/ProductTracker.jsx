export default function ProductTracker({ steps, stage }) {
  return (
    <ol className="flex items-start">
      {steps.map((item, i) => {
        const done = i < stage;
        const current = i === stage;
        const Icon = item.icon;
        return (
          <li
            key={item.label}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            {i > 0 && (
              <span
                className={`absolute left-[-50%] top-4 h-0.5 w-full ${
                  i <= stage ? "bg-black" : "bg-black/15"
                }`}
              />
            )}
            <span
              className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 ${
                done
                  ? "border-black bg-black text-white"
                  : current
                    ? "border-black bg-white"
                    : "border-black/20 bg-white text-neutral-400"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span
              className={`mt-2 text-[11px] sm:text-xs ${
                done || current ? "font-semibold" : "text-neutral-400"
              }`}
            >
              {item.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
