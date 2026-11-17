export default function Row({ label, value, green }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-neutral-600">{label}</dt>
      <dd className={green ? "font-semibold text-green-600" : "font-semibold"}>
        {value}
      </dd>
    </div>
  );
}
