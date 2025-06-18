import React from 'react'

const FreqQ = () => {
 const questions = [
    {
      q: " Will technicians at Urban Expert Service in Borivali West clean both internal and external units in case of a split AC?",
      a: "Ideally, the technicians are fully capable of handling both parts. Still, it is always better to ask representatives at Urban Expert Service before booking a service.",
    },
    {
      q: "Will they be able to service my ACs if I live on a higher floor?",
      a: "It is indeed more dangerous to service the external units of ACs mounted outside windows and structural elevations that do not offer adequate protection. Please check with the representative if a safety harness and other protective gear are provided for the safety of the technicians.",
    },
    {
      q: " Will technicians at Urban Expert Service in Borivali West clean both internal and external units in case of a split AC?",
      a: "Ideally, the technicians are fully capable of handling both parts. Still, it is always better to ask representatives at Urban Expert Service before booking a service.",
    },
    {
      q: "Will they be able to service my ACs if I live on a higher floor?",
      a: "It is indeed more dangerous to service the external units of ACs mounted outside windows and structural elevations that do not offer adequate protection. Please check with the representative if a safety harness and other protective gear are provided for the safety of the technicians.",
    },
  ];

  return (
       <div className="border border-gray-200 shadow-md rounded-xl p-4 overflow-y-auto scrollbar-hide max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-160px)] mt-4">
            <div className="text-xl sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-extralight">
              Frequently Asked Questions
            </div>
            <div>
              {questions.map((qs, index) => (
                <div
                  key={index}
                  className="flex flex-col my-3 text-sm sm:text-md md:text-md lg:text-md xl:text-md"
                >
                  <span className="fw-600">
                    {index + 1}. {qs?.q}
                  </span>
                  <span>A. {qs?.a}</span>
                </div>
              ))}
            </div>
          </div>
  )
}

export default FreqQ