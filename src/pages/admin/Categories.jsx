import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "../../components/ui/SearchBar";
import DataTable from "../../components/ui/DataTable";
import { useEffect, useState } from "react";
import { useInfiniteScroll } from "../../hooks/useInfineiteScrolling";
import { fetchAllCategories } from "../../redux/slice/categorySlice";
import { useSearchDebounce } from "../../hooks/useSearchDebounce";

function Categories() {
  const [openCategory, setOpenCategory] = useState(false);
  const dispatch = useDispatch();
  const { category, isCategoryLoading, categoryError, hasNextPage } =
    useSelector((state) => state.category);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(""); // raw input value
  const [isSearching, setIsSearching] = useState(false); //searching loading
  const [filterValues, setFilterValues] = useState({
    category: "",
    priceSort: "",
    sort: "",
  });

  console.log(category, "category");

  //category fetch
  useEffect(() => {
    dispatch(
      fetchAllCategories({
        pagination: {
          page,
          limit: 15,
          search,
          category: filterValues.category,
          sort: filterValues.sort,
        },
      }),
    );
  }, [page, search, filterValues.category, filterValues.sort]);

  const columns = [
    {
      header: "Category Name",
      render: (item) => (
        <>
          <p className="font-semibold">{item.name}</p>
        </>
      ),
    },
    {
      header: "Sub Category",
      render: (item) => <div>{item.subCategory?.name || "N/A"}</div>,
    },
    {
      header: "Specifications",
      render: (item) => <div>{item?.specSheets || "N/A"}</div>,
    },
    {
      header: "Created At",
      render: (item) =>
        item.createdAt && new Date(item.createdAt).toLocaleDateString(),
    },
    {
      header: "Modified At",
      render: (item) =>
        item.updatedAt &&
        new Date(item.updatedAt).toLocaleDateString() ===
          new Date(item.createdAt).toLocaleDateString()
          ? "N/A"
          : new Date(item.updatedAt).toLocaleDateString(),
    },
  ];

  // infinite scrolling
  const triggerId = useInfiniteScroll({
    hasNextPage,
    isLoading: isCategoryLoading,
    onLoadMore: () => setPage((prev) => prev + 1),
  });
  

   useSearchDebounce({
    setSearch,
    setPage,
    searchInput,
    setIsSearching,
    isLoading: isCategoryLoading,
  });

  return (
    <div className="w-full">
      <SearchBar
        colorVariants="admin"
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        filterOn={"categories"}
      />
      <div className="flex flex-col shadow-lg col-span-2 rounded-lg w-full items-center border min-w-[400px] px-4 justify-between mt-6">
        <DataTable
          title="All Categories"
          columns={columns}
          data={category}
          onRowClick={() => {
            setOpenCategory(true);
          }}
          footer={<div id={triggerId} className="h-10" />}
        />
      </div>
    </div>
  );
}

export default Categories;
