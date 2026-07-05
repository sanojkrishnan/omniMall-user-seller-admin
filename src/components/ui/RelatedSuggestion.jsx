import H2 from "./H2";
import P from "./P";

function RelatedSuggestion({ product, related }) {
  return (
    <>
      {/* Related — category based */}
      <div className="mx-auto max-w-6xl border-t border-neutral-200 px-6 py-12">
        <div className="flex items-baseline justify-between">
          <H2 className="font-medium">More in {product.category}</H2>
          <button className="text-xs font-medium underline underline-offset-2">
            View all
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {related.map((item, i) => (
            <a key={i} href="#" className="group block">
              <div className="aspect-[4/5] overflow-hidden border border-neutral-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <P className="mt-2">{item.name}</P>
              <P className="font-medium">₹{item.price.toLocaleString()}</P>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export default RelatedSuggestion;
