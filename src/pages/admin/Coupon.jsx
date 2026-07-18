import { Plus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import { SearchBar } from "../../components/ui/SearchBar";
import { useInfiniteScroll } from "../../hooks/useInfineiteScrolling";

const coupon = [
  {
    code: "WELCOME10",
    name: "Welcome Offer",
    description: "10% off on first purchase",
    discountType: "percentage",
    discountValue: 10,
    maxDiscount: 500,
    minOrderAmount: 1000,
    startDate: "2026-07-20",
    endDate: "2026-07-31",
    status: "active",
    usageLimit: 1000,
    usagePerUser: 1,
    applicableProducts: [],
    applicableCategories: [],
    excludedProducts: [],
    sellerIds: [],
    eligibleUsers: "new_users",
    paymentMethods: ["UPI", "CARD"],
    stackable: false,
    autoApply: false,
    createdBy: "adminId",
  },
];

function Coupon() {
  //     const triggerId = useInfiniteScroll({
  //     hasNextPage,
  //     isLoading: isProductLoading,
  //     onLoadMore: () => setPage((prev) => prev + 1),
  //   });

  const columns = [
    {
      header: "Coupon Name",
      render: (item) => <div>{item.name || "N/A"}</div>,
    },
    {
      header: "Coupon Code",
      render: (item) => <div>{item?.specSheets || "N/A"}</div>,
    },
    {
      header: "Discount Type",
      render: (item) => <div>{item?.specSheets || "N/A"}</div>,
    },
    {
      header: "Discount Value",
      render: (item) => <div>{item?.specSheets || "N/A"}</div>,
    },
    {
      header: "Start Date",
      render: (item) => <div>N/A</div>,
    },
    {
      header: "End Date",
      render: (item) => <div>N/A</div>,
    },
  ];

  return (
    <div className="w-full">
      <Button
        className={"bg-[#5f0000] w-fit px-4"}
        onClick={() => {
          // setAddProduct(true);
          // setOpenProduct(false);
        }}
      >
        <Plus /> Add Products
      </Button>
      {/* <SearchBar
        colorVariants="admin"
        // filterValues={filterValues}
        // setFilterValues={setFilterValues}
        // value={searchInput}
        // onChange={(e) => setSearchInput(e.target.value)}
        filterOn={"categories"}
      /> */}
      <div className="flex flex-col shadow-lg col-span-2 rounded-lg w-full items-center border min-w-[400px] px-4 justify-between mt-6">
        <DataTable
          title="All Categories"
          columns={columns}
          data={coupon}
          onRowClick={() => {}}
          //   footer={<div id={triggerId} className="h-10" />}
        />
      </div>
    </div>
  );
}

export default Coupon;
