
import { Avatar } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

// Function to generate random seed
const generateRandomSeed = () => Math.random().toString(36).substring(7);

// Complementary background colors that work well with the avatars
const bgColors = [
  "bg-[#D3E4FD]", // Soft Blue
  "bg-[#E5DEFF]", // Soft Purple
  "bg-[#FFDEE2]", // Soft Pink
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
            className={`border-2 border-background ${bgColors[index]}`}
          >
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} 
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
