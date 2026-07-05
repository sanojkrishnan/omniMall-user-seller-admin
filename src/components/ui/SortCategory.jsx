import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../../redux/slice/categorySlice";
import { Frown } from "lucide-react";
import P from "./P";

function SortCategory({ setFilterValues }) {
  const [select, setSelect] = useState("");
  const dispatch = useDispatch();

  const { category, isCategoryLoading, categoryError } = useSelector(
    (state) => state.category,
  );

  useEffect(() => {
    dispatch(
      fetchAllCategories({
        pagination: {
          page: 1,
          limit: 15,
        },
      }),
    );
  }, [dispatch]);
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 lg:gap-6 px-5 mt-5">
      {isCategoryLoading &&
        !categoryError &&
        [0, 1, 2, 3, 4, 5].map(() => (
          <div className="rounded-xl relative text-sm h-40 hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden bg-gray-200 dark:bg-gray-700">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        ))}
      {!isCategoryLoading &&
        !categoryError &&
        category.length > 0 &&
        category.map((item, index) => {
          return (
            <div
              className={`${select === item.name ? "border-2" : ""} rounded-xl relative text-sm h-40 hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden`}
              key={index}
              onClick={() => {
                setFilterValues((prev) => ({ ...prev, category: item.name }));
                setSelect(item.name);
              }}
            >
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                src={item.categoryImage.url}
                alt={item.name}
              />
              <div className="absolute w-full h-full hover:shadow-[inset_0_-70px_70px_rgba(0,0,0,100)] transition-all duration-500 rounded-lg shadow-[inset_0_-50px_50px_rgba(0,0,0,100)] flex items-end justify-center">
                <P className="w-fit mb-2 px-4 text-white">{item.name}</P>
              </div>
            </div>
          );
        })}
      {!isCategoryLoading &&
        categoryError &&
        [0, 1, 2, 3, 4, 5].map(() => (
          <div className="rounded-xl relative text-sm h-40 overflow-hidden flex justify-center items-center bg-gray-200 dark:bg-gray-700">
            <Frown className="size-20 text-gray-400" />
          </div>
        ))}
    </div>
  );
}

export default SortCategory;
