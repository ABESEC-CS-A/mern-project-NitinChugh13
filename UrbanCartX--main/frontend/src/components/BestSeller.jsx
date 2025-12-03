import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { shopDataContext } from "../context/ShopContext";
import Card from "./Card";

function BestSeller() {
  const { products = [] } = useContext(shopDataContext) || {};
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const filtered = products.filter((item) => {
        return (
          item?.isBestSeller === true ||
          item?.bestSeller === true ||
          item?.tag === "bestseller" ||
          item?.tags?.includes?.("bestseller")
        );
      });

      setBestSellers(filtered.slice(0, 8));
    } else {
      setBestSellers([]);
    }
  }, [products]);

  return (
    <section className="mt-10 md:mt-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <Title text1={"Best"} text2={"Sellers"} />
        <p className="text-[13px] md:text-[20px] text-blue-100 mb-8">
          Customer Favorites You Can&apos;t Miss!
        </p>
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
          {bestSellers.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 py-10">
              No best sellers yet.
            </div>
          ) : (
            bestSellers.map((item) => {
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

export default BestSeller;
