import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { shopDataContext } from "../context/ShopContext";
import Card from "./Card";

function LatestCollection() {
  const { products = [] } = useContext(shopDataContext) || {};
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    // ensure products is an array; pick first 8
    if (Array.isArray(products) && products.length > 0) {
      setLatestProducts(products.slice(0, 8));
    } else {
      setLatestProducts([]);
    }
  }, [products]);

  return (
    <section className="mt-10 md:mt-16 px-4">
     <div className="max-w-4xl mx-auto text-center">
  <Title text1={"Latest"} text2={"Collection"} />
  <p className="text-[14px] md:text-[18px] text-slate-300 mb-6">
    Step Into Style - New Collections Await!
  </p>
  <div className="max-w-[90%] mx-auto border-t border-[#ffffff10] mb-6" />
</div>

      <div className="max-w-6xl mx-auto px-4">
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
            justify-items-center
          "
        >
          {latestProducts.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 py-10">
              No products yet.
            </div>
          ) : (
            latestProducts.map((item) => {
              // choose the right image field from your product object:
              const img = item.image1 || item.images?.[0] || item.image || "";
              const id = item._id || item.id;
              return (
                <Card
                  key={id || item.name}
                  itemId={id}
                  name={item.name}
                  image={img}
                  price={item.price}
                  category={item.category}
                />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default LatestCollection;
