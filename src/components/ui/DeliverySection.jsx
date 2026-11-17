import { useCurrency } from "../../hooks/useCurrency";
import { DELIVERY_OPTIONS, FREE_DELIVERY_ABOVE } from "./Constant";
import Radio from "./Radio";
import Section from "./Section";

export default function DeliverySection({
  step,
  deliveryId,
  onChange,
  subtotal,
}) {
  const inr = useCurrency();
  return (
    <Section step={step} title="Delivery option">
      <div className="space-y-3">
        {DELIVERY_OPTIONS.map((d) => {
          const free = d.id === "standard" && subtotal >= FREE_DELIVERY_ABOVE;
          return (
            <Radio
              key={d.id}
              selected={deliveryId === d.id}
              onClick={() => onChange(d.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <d.icon className="h-4 w-4" />
                  <span className="font-semibold">{d.label}</span>
                </div>
                <span className="text-sm font-bold">
                  {free ? "FREE" : inr(d.fee)}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Arrives in {d.eta}
                {d.id === "standard" &&
                  ` · free above ${inr(FREE_DELIVERY_ABOVE)}`}
              </p>
            </Radio>
          );
        })}
      </div>
    </Section>
  );
}
