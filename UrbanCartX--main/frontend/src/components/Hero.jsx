import React from 'react'
import { FaCircle } from "react-icons/fa";

function Hero({ heroData, heroCount, setHeroCount }) {
  return (
    <div className="w-full md:w-[80%] lg:w-[70%] h-full relative">

        <div
  className="absolute text-[#88d9ee] text-[20px]
  md:text-[40px] lg:text-[55px] md:left-[10%] md:top-[90px]
  lg:top-[130px] left-[10%] top-2.5 max-w-[18rem] md:max-w-[24rem] leading-tight"
>
  <p>{heroData.text1}</p>
  <p>{heroData.text2}</p>
</div>

        <div
  className="absolute md:top-[360px] lg:top-[440px]
  top-40 left-[10%] flex items-center justify-center gap-3"
>
            <FaCircle className={`w-3.5 ${heroCount === 0 ? "fill-orange-400":"fill-white" } `} 
            onClick={() => setHeroCount(0)}/>
            <FaCircle className={`w-3.5 ${heroCount === 1 ? "fill-orange-400":"fill-white" } `} 
            onClick={() => setHeroCount(1)}/>
            <FaCircle className={`w-3.5 ${heroCount === 2 ? "fill-orange-400":"fill-white" } `} 
            onClick={() => setHeroCount(2)}/>
            <FaCircle className={`w-3.5 ${heroCount === 3 ? "fill-orange-400":"fill-white" } `} 
            onClick={() => setHeroCount(3)}/>
        </div>
      
    </div>
  )
}

export default Hero
