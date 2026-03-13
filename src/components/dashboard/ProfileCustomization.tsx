'use client';

export function ProfileCustomization() {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-sm font-medium text-gray-700 mb-1">Profile Customization</p>
      <p className="text-xs text-gray-500 mb-2">Complete profile to unlock more features</p>
      <button className="text-sm text-[#4F8F73] font-medium hover:underline">
        Finish Customization
      </button>
    </div>
  );
}
