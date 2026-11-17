import { inputCls } from "./Constant";
import Section from "./Section";

export default function NoteSection({ step, note, onChange }) {
  return (
    <Section step={step} title="Order note (optional)">
      <textarea
        rows={3}
        value={note}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Delivery instructions, gift message..."
        className={inputCls}
      />
    </Section>
  );
}
