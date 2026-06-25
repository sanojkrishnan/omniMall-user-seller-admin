import Footer from "../../components/Footer";

function Shop() {
  return (
     <div className="absolute inset-0">
      {/* this div is to fill the space of header  */}
      <div className="w-full h-16 "></div>

      {/* footer */}
      <div className="mt-4 absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
}

export default Shop;
