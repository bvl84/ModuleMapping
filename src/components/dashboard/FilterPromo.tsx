'use client';

export function FilterPromo() {
  return (
    <div className="bg-[#2C4A3E] rounded-xl p-6 text-white flex flex-col items-center text-center">
      <div className="w-32 h-40 bg-[#3a5f50] rounded-lg mb-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs opacity-70">MERV</p>
          <p className="text-3xl font-bold">11</p>
          <div className="w-16 h-px bg-white/30 my-1 mx-auto" />
          <p className="text-[10px] opacity-60">PREMIUM FILTER</p>
          <p className="text-[10px] opacity-60">90 DAY</p>
        </div>
      </div>
      <h3 className="text-lg font-medium mb-1">Than you for being a member.</h3>
      <p className="text-sm opacity-80 mb-4">
        Enjoy a premium Home Solutions MERV certified air filter on us.
      </p>
      <button className="bg-white text-[#2C4A3E] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
        Ship my free filter
      </button>
    </div>
  );
}
