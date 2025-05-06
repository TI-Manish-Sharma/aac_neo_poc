import React from 'react';
import Image from 'next/image';
import Link  from 'next/link';

const HeroSection = () => {
  return (
    <section className="bg-gray-100 py-10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="mb-10 lg:mb-0">
            <div className="mb-6">
              <div className="flex items-center mb-6">
                <Image
                  src="/aac-neo-icon.png"
                  alt="AAC Neo Icon"
                  width={150}
                  height={150}
                  className="mr-4"
                />
                <h1 className="text-4xl md:text-5xl font-bold mb-0">
                  <span className="text-cyan-300">AAC Neo</span>
                  <br />
                  <span className="text-gray-900">Plant Intelligence</span>
                </h1>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Advanced monitoring and analytics for your Autoclaved Aerated Concrete
                production facility with real-time insights and predictive analysis.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="bg-cyan-400 hover:bg-cyan-500 text-white font-medium px-6 py-3 rounded-lg transition duration-300">
                  Request Demo
                </Link>
                <button className="border border-gray-400 hover:border-gray-500 text-gray-700 font-medium px-6 py-3 rounded-lg transition duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Right column - Image and stats */}
          <div className="relative">
            <div className="bg-white p-2 rounded-xl shadow-md overflow-hidden">
              <Image
                src="/aac-block.jpg"
                alt="AAC Plant Dashboard"
                width={600}
                height={400}
                className="rounded-lg w-full h-auto"
                priority
              />
            </div>

            {/* Top-right floating badge */}
            <div className="absolute top-0 right-4 -translate-y-1/2">
              <div className="bg-white p-3 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-lg">97%</h5>
                    <p className="text-xs text-gray-500">Quality Improvement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-left floating badge */}
            <div className="absolute bottom-0 left-4 translate-y-1/2">
              <div className="bg-white p-3 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-lg">-42%</h5>
                    <p className="text-xs text-gray-500">Rejection Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;