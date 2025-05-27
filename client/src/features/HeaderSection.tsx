const HeaderSection = () => {
  return (
    <div className="w-full bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - New Arrival text and small images */}
          <div className="space-y-6">
            <h1 className="text-6xl font-bold text-gray-700 leading-tight">
              NEW
              <br />
              ARRIVAL
            </h1>

            {/* Small placeholder images */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="aspect-square border-2 border-gray-300 bg-white relative"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full relative">
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-300 rotate-45 origin-top-left transform translate-y-[50%]"></div>
                      <div className="absolute top-0 right-0 w-full h-0.5 bg-gray-300 -rotate-45 origin-top-right transform translate-y-[50%]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Large featured image */}
          <div className="relative">
            <div className="aspect-[4/5] border-2 border-gray-300 bg-white relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full relative">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-300 rotate-45 origin-top-left transform translate-y-[50%]"></div>
                  <div className="absolute top-0 right-0 w-full h-0.5 bg-gray-300 -rotate-45 origin-top-right transform translate-y-[50%]"></div>
                </div>
              </div>

              {/* THE DJ label */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white border border-gray-300 px-4 py-2 text-center">
                  <span className="text-gray-600 font-medium">THE DJ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
