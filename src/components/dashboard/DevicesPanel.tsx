'use client';

import { useState } from 'react';
import type { Device } from '../../types/scoring';

interface DevicesPanelProps {
  devices: Device[];
}

export function DevicesPanel({ devices: initialDevices }: DevicesPanelProps) {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [adjustments] = useState(3);

  const addDevice = () => {
    const newDevice: Device = {
      id: `device_${Date.now()}`,
      name: 'New Device',
      icon: '📱',
      status: 'Online',
    };
    setDevices(prev => [...prev, newDevice]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">My Devices</h3>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-[#4F8F73] text-white rounded-full text-xs flex items-center justify-center font-medium">
            {adjustments}
          </span>
          <span className="text-sm text-gray-500">Adjustments active</span>
          <button className="text-sm text-[#4F8F73] font-medium hover:underline ml-1">
            View →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {devices.map((device) => (
          <div key={device.id} className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="h-20 flex items-center justify-center mb-3">
              {device.name === 'Thermostat' ? (
                <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center">
                  <span className="text-white text-xl font-light">{device.value || '72'}</span>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">{device.icon}</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2">{device.name}</p>
            <div className="flex items-center gap-1.5">
              <div className={`w-full h-1.5 rounded-full ${device.status === 'Online' ? 'bg-[#4F8F73]' : 'bg-gray-300'}`} />
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${device.status === 'Online' ? 'bg-[#4F8F73]' : 'bg-gray-300'}`} />
              <span className="text-xs text-gray-500">{device.status}</span>
            </div>
          </div>
        ))}

        {/* Add Device slots */}
        {[...Array(Math.max(0, 4 - devices.length))].map((_, i) => (
          <button
            key={`add_${i}`}
            onClick={addDevice}
            className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center min-h-[160px]"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <span className="text-gray-500 text-lg">+</span>
            </div>
            <span className="text-sm text-gray-500 font-medium">Add Device</span>
          </button>
        ))}
      </div>
    </div>
  );
}
