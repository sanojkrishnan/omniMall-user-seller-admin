import { Minus, Plus, Trash2 } from "lucide-react";
import P2 from "./ui/P2";

function CartProductCard({ item, sellerId, onQtyChange, onRemove }) {
  return (
    <div
      key={item.id}
      className="flex gap-4 rounded-lg border hover:shadow-lg hover:scale-105 transition-all duration-500 border-neutral-200 p-3 lg:p-4"
    >
      <img
        src={item.img}
        alt={item.name}
        className="h-20 w-20 lg:h-24 lg:w-24 rounded-lg object-cover bg-neutral-100 flex-shrink-0"
      />

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <P2 className="font-medium text-left truncate">{item.name}</P2>
            <P2 className="text-xs text-left text-neutral-500 mt-0.5">
              {item.variant}
            </P2>
          </div>
          <button
            aria-label={`Remove ${item.name}`}
            onClick={() => onRemove(item.id)}
            className="text-neutral-400 hover:text-black transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg p-1"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center rounded-lg border border-neutral-200">
            <button
              aria-label="Decrease quantity"
              disabled={item.qty <= 1}
              onClick={() => onQtyChange(item.id, sellerId, item.qty - 1)}
              className="p-1.5 text-neutral-600 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-l-lg disabled:opacity-30 disabled:hover:text-neutral-600"
            >
              <Minus size={12} strokeWidth={2} />
            </button>
            <span className="w-7 text-center text-xs font-medium text-black tabular-nums">
              {item.qty}
            </span>
            <button
              aria-label="Increase quantity"
              onClick={() => onQtyChange(item.id, sellerId, item.qty + 1)}
              className="p-1.5 text-neutral-600 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-r-lg"
            >
              <Plus size={12} strokeWidth={2} />
            </button>
          </div>
          <span className="text-sm font-semibold text-black tabular-nums">
            ${(item.price * item.qty).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartProductCard;
