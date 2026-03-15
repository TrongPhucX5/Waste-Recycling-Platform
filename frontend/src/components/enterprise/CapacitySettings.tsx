import React from "react";
import { Card, Button, Input } from "../ui";

interface CapacitySettingsProps {
  capacity: {
    maxCapacity: number;
    wasteTypes: string[];
    serviceArea: string;
  };
  onUpdate: (newCapacity: any) => void;
}

const MOCK_WASTE_TYPES = [
  { value: "plastic", label: "Plastic" },
  { value: "paper", label: "Paper" },
  { value: "metal", label: "Metal" },
  { value: "glass", label: "Glass" },
];

export const CapacitySettings: React.FC<CapacitySettingsProps> = ({ capacity, onUpdate }) => {
  return (
    <Card className="p-6 max-w-2xl">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Capacity & Service Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Processing Capacity (kg/day)</label>
          <Input 
            type="number" 
            value={capacity.maxCapacity} 
            onChange={(e) => onUpdate({...capacity, maxCapacity: parseInt(e.target.value)})}
          />
        </div>
        
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
           <Input 
             value={capacity.serviceArea}
             onChange={(e) => onUpdate({...capacity, serviceArea: e.target.value})}
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Accepted Waste Types</label>
           <div className="flex gap-2 flex-wrap">
             {MOCK_WASTE_TYPES.map(type => (
               <label key={type.value} className="flex items-center gap-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                 <input 
                   type="checkbox" 
                   checked={capacity.wasteTypes.includes(type.value)}
                   onChange={(e) => {
                     if(e.target.checked) onUpdate({...capacity, wasteTypes: [...capacity.wasteTypes, type.value]});
                     else onUpdate({...capacity, wasteTypes: capacity.wasteTypes.filter((t: string) => t !== type.value)});
                   }}
                   className="rounded text-emerald-600 focus:ring-emerald-500"
                 />
                 <span className="text-sm font-medium text-gray-700">{type.label}</span>
               </label>
             ))}
           </div>
        </div>

        <div className="pt-4">
           <Button>Save Configuration</Button>
        </div>
      </div>
    </Card>
  );
};