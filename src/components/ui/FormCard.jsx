import { cn } from "../../utils/CN";

export const FormCard = ({ className, children }) => {
  return (
    <div
      className={cn(
        "overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent max-w-[500px] min-w-[310px] max-h-[550px] shadow-black/50 shadow-lg bg-gradient-to-br  from-white/0 via-white/40 to-white/0 backdrop-blur-md rounded-xl p-8",
        className,
      )}
    >
      {children}
    </div>
  );
};
