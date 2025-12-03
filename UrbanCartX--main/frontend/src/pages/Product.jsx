import React from 'react'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'

function Product() {
  return (
    <div className="w-screen min-h-screen bg-linear-to-b from-[#141414] to-[#0c2025] flex items-center justify-start flex-col py-5">
      <div className="w-screen min-h-screen bg-linear-to-b from-[#141414] to-[#0c2025] flex items-center justify-start flex-col py-5">
        <LatestCollection/>

      </div>

       <div className='w-screen min-h-screen bg-linear-to-1 from [#141414] to-[#0c2025] flex items-center justify-start flex-col py-5'>
        <BestSeller/>

      </div>
    </div>
  )
}

export default Product
