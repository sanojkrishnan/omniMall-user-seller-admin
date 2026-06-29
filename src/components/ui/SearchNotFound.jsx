function SearchNotFound({ search }) {
  return (
    <div className="w-full h-[60vh] flex flex-col justify-center items-center gap-3">
      <h1 className="text-xl font-semibold text-gray-800">No products found</h1>
      {search && (
        <p className="text-sm text-gray-500">
          No results for "<span className="font-medium">{search}</span>" — try a
          different keyword
        </p>
      )}
    </div>
  );
}

export default SearchNotFound;
