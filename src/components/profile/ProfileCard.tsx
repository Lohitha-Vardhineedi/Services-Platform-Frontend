import React, { useState } from 'react'
import { CiStar } from 'react-icons/ci'
import { FaRegBookmark, FaThumbsUp } from 'react-icons/fa6'
import { IoCall, IoLocationOutline, IoShareSocial, IoShareSocialOutline } from 'react-icons/io5'
import { LuMessageSquareText } from 'react-icons/lu'
import { MdOutlineStar } from 'react-icons/md'

const ProfileCard = () => {
    const [save, setSave] = useState(false)

    return (
        <div className='border border-gray-300 rounded-xl p-5 flex flex-col md:flex-row '>
            <div className="flex-1">
                <h2 className="text-xl sm:text-xl md:text-xl lg:text-xl xl:text-2xl font-semibold">
                    BMR Services
                </h2>
                <div className="flex gap-4 items-center my-3 text-2xl">
                    <div className="flex items-center border border-amber-500 rounded-lg px-1  text-black text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-bold">
                        4.8
                        <MdOutlineStar size={20} className="ms-1 " color="#ffc71b" />
                    </div>
                    <div className="text-gray-600 text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight">84 Ratings</div>
                </div>

                <div className="flex gap-2">
                    <div className=" bg-fuchsia-200 px-3 py-1 rounded-xl text-black text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight">
                        Ac Repair & Services
                    </div>
                </div>
                <div className="flex my-3 items-center">
                    <IoLocationOutline size={27} color="red" />
                    <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
                        {" "}
                        SR Nagar, Hyderabad, Telangana
                    </span>
                </div>
                <div className="flex items-center">
                    <FaThumbsUp size={22} color="#00B800" className='flex' />
                    <span className="text-sm sm:text-sm md:text-lg lg:text-lg xl:text-lg font-extralight ms-2">
                        {" "}
                        5 Years in Services
                    </span>
                </div>

                <div className="flex gap-4 mt-4">
                    <div className="flex bg-fuchsia-500 rounded-xl  text-white px-4 py-1 font-bold items-center cursor-pointer hover:bg-fuchsia-600">
                        <IoCall size={22} className="me-2" />
                        <span>9876543212</span>
                    </div>

                    <div className="flex bg-neutral-200 rounded-xl  text-green px-4 py-1 font-bold items-center cursor-pointer hover:bg-neutral-300">

                        <img
                            src="https://cdn-icons-png.freepik.com/256/134/134937.png?uid=R149535454&ga=GA1.1.186113507.1743993848&semt=ais_incoming"
                            className="h-6 w-6 me-2"
                        />
                        <span className="">Whatsup</span>
                    </div>

                    <div className="flex bg-green-600 rounded-xl text-white px-4 py-1 font-bold items-center cursor-pointer hover:bg-green-500">
                        <LuMessageSquareText size={22} className="me-3" />
                        <span className="">Message</span>
                    </div>
                    <div className="flex bg-blue-500 rounded-xl  text-white px-4 py-1 font-bold items-center cursor-pointer hover:bg-blue-600">
                        <IoShareSocial size={22} className="me-3" />
                        <span className="">Share</span>
                    </div>

                </div>
            </div>

            <div className='flex flex-col justify-between'>
                <div className='flex justify-end'>
                    <div className={`border border-gray-500 rounded-xl p-2 flex items-end cursor-pointer ${setSave === true ? "clr-black" : ""}`}
                        onClick={() => setSave(!save)}
                    >
                        <FaRegBookmark size={20} />
                    </div>
                </div>

                <div className=''>
                    <div className='text-sm sm:text-sm md:text-md lg:text-lg xl:text-lg mb-2 '>Click to Rate</div>
                    <div className='flex gap-4'>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className='border border-gray-500 rounded-xl p-1 '>
                            <CiStar size={25} className='hover:bg-amber-500'/>
                        </div>
                    ))}
                    </div>
                </div>

            </div>


        </div>
    )
}

export default ProfileCard