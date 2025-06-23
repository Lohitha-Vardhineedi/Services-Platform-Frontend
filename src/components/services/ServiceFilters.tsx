import React from 'react'
import { FaBolt } from 'react-icons/fa6'
import { HiAdjustmentsHorizontal } from 'react-icons/hi2'
import { MdOutlineStar } from 'react-icons/md'
import { RiDiscountPercentFill } from 'react-icons/ri'

export const ServiceFilters = () => {
  return (
    <div className='flex flex-wrap my-3 gap-4 px-2 '>
      <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl hover:bg-fuchsia-300'>
        <select className="bg-transparent outline-none w-full cursor-pointer text-sm sm:text-sm md:text-md lg:text-md xl:text-lg"
          defaultValue="">
          <option value="" disabled hidden>
            Sort By
          </option>
          <option value="relevance">Relevance</option>
          <option value="rating">Rating</option>
          <option value="popular">Popular</option>
          <option value="distance">Distance</option>
        </select>
      </div>

      <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl hover:bg-fuchsia-300'>
        <select className="bg-transparent outline-none w-full cursor-pointer text-sm sm:text-sm md:text-md lg:text-md xl:text-lg"
          defaultValue="">
          <option value="" disabled hidden>
            Services
          </option>
          <option value="authorised">Authorised</option>
          <option value="doorStep">Door Step</option>
        </select>
      </div>

      <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl cursor-pointer hover:bg-fuchsia-300 items-center'>
        <MdOutlineStar size={23} className=" d-flex" color="#ffc71b" />
        <span className='text-sm sm:text-sm md:text-md lg:text-md xl:text-lg ms-2'>Top Rated</span>

      </div>
      <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl cursor-pointer hover:bg-fuchsia-300 items-center'>
        <FaBolt size={20} className=" d-flex"  color='#00b800'/>
        <span className='text-sm sm:text-sm md:text-md lg:text-md xl:text-lg ms-2'>Quick Response</span>

      </div>
      <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl cursor-pointer hover:bg-fuchsia-300 items-center'>
        <RiDiscountPercentFill size={23} className=" d-flex clr-purple"  />
        <span className='text-sm sm:text-sm md:text-md lg:text-md xl:text-lg ms-2'>Deals</span>

      </div>
      <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl hover:bg-fuchsia-300'>
        <select className="bg-transparent outline-none w-full cursor-pointer text-sm sm:text-sm md:text-md lg:text-md xl:text-lg"
          defaultValue="">
          <option value="" disabled hidden>
            Ratings
          </option>
          <option value="relevance">1.0</option>
          <option value="rating">2.0</option>
          <option value="popular">3.0</option>
          <option value="distance">4.0</option>
          <option value="distance">5.0</option>
        </select>
      </div>
      <div className='border border-gray-500 shadow py-2 px-4 flex rounded-xl cursor-pointer hover:bg-fuchsia-300 items-center'>
        <HiAdjustmentsHorizontal size={23} className=" d-flex clr-blue"  />
        <span className='text-sm sm:text-sm md:text-md lg:text-md xl:text-lg ms-2'>All Filters</span>

      </div>

    </div>


  )
}