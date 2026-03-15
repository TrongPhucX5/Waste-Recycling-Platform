import React, { useState } from "react";
import { Card, Button, Input } from "../ui";

interface RewardConfigurationProps {
  initialRules: { type: string; pointsPerKg: number }[];
}

export const RewardConfiguration: React.FC<RewardConfigurationProps> = ({ initialRules }) => {
  const [rewardRules, setRewardRules] = useState(initialRules);

  const handleUpdate = (index: number, value: string) => {
    const newRules = [...rewardRules];
    newRules[index].pointsPerKg = parseInt(value) || 0;
    setRewardRules(newRules);
  };

  return (
    <Card className="p-6">
       <h2 className="text-xl font-bold mb-6 text-gray-800">Reward Configuration</h2>
       <div className="bg-blue-50 p-4 rounded-lg mb-6 text-blue-800 text-sm">
         Configure points awarded to citizens for each waste type. These rules apply to all future collections.
       </div>

       <div className="space-y-4">
         {rewardRules.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-4 border-b border-gray-100 pb-4">
               <div className="w-1/3">
                 <span className="text-sm font-bold text-gray-700">{rule.type}</span>
               </div>
               <div className="w-1/3">
                 <Input 
                   type="number" 
                   value={rule.pointsPerKg}
                   onChange={(e) => handleUpdate(idx, e.target.value)}
                   placeholder="Points"
                 />
               </div>
               <div className="w-1/3 text-sm text-gray-500">
                 Points per kg
               </div>
            </div>
         ))}
         
         <div className="pt-4">
            <Button>Update Rules</Button>
         </div>
       </div>
    </Card>
  );
};