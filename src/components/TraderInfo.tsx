
import { Avatar } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

// Function to generate random seed
const generateRandomSeed = () => Math.random().toString(36).substring(7);

// Complementary background colors that match the dashboard header
const bgColors = [
  "bg-[#D3E4FD]", // Soft Blue
  "bg-[#FFDEE2]", // Soft Pink
  "bg-[#E5DEFF]", // Soft Purple
];

export function TraderInfo() {
  const [seeds, setSeeds] = useState<string[]>([]);

  useEffect(() => {
    // Generate new random seeds on component mount
    setSeeds([
      generateRandomSeed(),
      generateRandomSeed(),
      generateRandomSeed(),
    ]);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-3">
        {seeds.map((seed, index) => (
          <Avatar 
            key={seed} 
            className={`border-2 border-background ${bgColors[index]} transition-transform hover:scale-105`}
          >
            <img 
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`} 
              alt={`Trader ${index + 1}`} 
            />
          </Avatar>
        ))}
      </div>
      <div className="text-xs leading-tight">
        <p>Built using inputs from</p>
        <p className="font-medium">45+ Intraday traders</p>
      </div>
    </div>
  );
}
