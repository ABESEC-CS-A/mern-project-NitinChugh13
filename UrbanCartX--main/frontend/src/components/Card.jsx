// src/components/Card.jsx
import React, { useContext } from "react";
import { shopDataContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

function Card({ name, image, itemId, price }) {
  const { currency } = useContext(shopDataContext);
  const navigate = useNavigate();

  const onClick = () => navigate(`/productdetail/${itemId}`);
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Open product ${name}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={
        "w-full sm:w-[300px] max-w-[90%] h-auto sm:h-[420px] rounded-lg " +
        // black card body
        "bg-black text-white " +
        // layout & interactivity
        "flex flex-col items-start justify-start p-0 cursor-pointer border border-[#ffffff14] " +
        "overflow-hidden transform transition-all duration-250 sm:hover:scale-105 sm:hover:-translate-y-1 " +
        "shadow-md sm:hover:shadow-xl"
      }
    >
      {/* image area kept white so product image shows clearly */}
      <div className="w-full h-[60vw] sm:h-[68%] p-[10px] bg-white/100 flex items-center justify-center">
        <img
          src={image}
          alt={name || "product"}
          loading="lazy"
          className="w-full h-full rounded-md object-contain block"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "/placeholder.png"; // ensure you have a placeholder in public or change path
          }}
        />
      </div>

      {/* card content on black */}
      <div className="w-full px-4 py-3 flex flex-col gap-1 bg-transparent">
        <div className="text-[#cdeff3] text-[18px] font-medium leading-tight truncate">
          {name}
        </div>
        <div className="text-[#f7fbfb] text-[14px] opacity-90">
          {currency || "₹"}
          {typeof price === "number" ? price.toLocaleString("en-IN") : price}
        </div>
      </div>
    </article>
  );
}

export default Card;
