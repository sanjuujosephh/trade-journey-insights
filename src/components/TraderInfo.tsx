
import { Avatar } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

// Function to generate random seed
const generateRandomSeed = () => Math.random().toString(36).substring(7);

// Soft pastel colors that work well with the design
const bgColors = [
  "bg-blue-100", // Soft Blue
  "bg-purple-100", // Soft Purple
  "bg-pink-100", // Soft Pink
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
    <div className="flex items-center gap-3 py-1">
      <div className="flex -space-x-3">
        {seeds.map((seed, index) => (
          <Avatar 
            key={seed} 
            className={`border-2 border-background ${bgColors[index]} transition-transform hover:scale-110`}
          >
            <img 
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`} 
              alt={`Trader ${index + 1}`} 
            />
          </Avatar>
        ))}
      </div>
      <div className="text-xs leading-tight">
        <p className="text-muted-foreground">Built using inputs from</p>
        <p className="font-medium">45+ Intraday traders</p>
      </div>
    </div>
  );
}
