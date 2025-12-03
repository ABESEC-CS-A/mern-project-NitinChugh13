import React, { useState, useEffect } from "react";
import Background from "../components/Background";
import Hero from "../components/Hero";
import Product from "./Product";
import OurPolicy from "../components/OurPolicy";
import Footer from "../components/Footer";

function Home() {
  let heroData = [
    { text1: "30% OFF Limited Offer", text2: "Style that" },
    { text1: "Discover the Best Fashion", text2: "Limited Time Only!!" },
    { text1: "Explore Our Best Collections", text2: "Shop Now!" },
    { text1: "Choose Your Perfect Fit", text2: "Now On Sale" },
  ];

  // for sliding images
  let [heroCount, setHeroCount] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setHeroCount((prevCount) => (prevCount === 3 ? 0 : prevCount + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
  <div className="overflow-x-hidden relative top-[70px]">

    <div
      className="
        w-full
        flex
        bg-gradient-to-b from-[#141414] to-[#0c2025]
        h-[230px]        /* mobile hero strip */
        sm:h-[260px]
        md:h-screen      /* desktop full screen */
      "
    >
      {/* LEFT HERO SECTION */}
      <div className="w-1/2 h-full flex items-center">
        <Hero
          heroData={heroData[heroCount]}
          heroCount={heroCount}
          setHeroCount={setHeroCount}
        />
      </div>

      {/* RIGHT IMAGE SECTION */}
      <div className="w-1/2 h-full overflow-hidden">
        <Background heroCount={heroCount} />
      </div>
    </div>

    {/* Page content below */}
   <Product preview />
   <OurPolicy />
   <Footer />

  </div>
);
}

export default Home;
