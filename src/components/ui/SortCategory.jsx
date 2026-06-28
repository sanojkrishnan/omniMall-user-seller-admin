
function SortCategory({ categoryList }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 lg:gap-6 px-5 mt-5">
      {categoryList.map((item, index) => {
        return (
          <div
            className="relative text-sm h-40 hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden"
            key={index}
          >
            <img
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
              src={item.image}
              alt={item.alt}
            />
            <div className="absolute w-full h-full hover:shadow-[inset_0_-70px_70px_rgba(0,0,0,100)] transition-all duration-500 rounded-lg shadow-[inset_0_-50px_50px_rgba(0,0,0,100)] flex items-end justify-center">
              <p className="text-center w-fit mb-2 px-4 text-white">
                {item.category}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SortCategory;
