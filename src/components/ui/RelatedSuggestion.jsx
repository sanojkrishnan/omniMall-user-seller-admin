
function RelatedSuggestion({product , related}) {
  return (
    <>
      {/* Related — category based */}
      <div className="mx-auto max-w-6xl border-t border-neutral-200 px-6 py-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-medium">More in {product.category}</h2>
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
              <p className="mt-2 text-sm">{item.name}</p>
              <p className="text-sm font-medium">
                ₹{item.price.toLocaleString()}
              </p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export default RelatedSuggestion;
