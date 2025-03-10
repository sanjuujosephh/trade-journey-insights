
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <div className="container mx-auto py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-6 md:text-6xl">This trading journal that helps you build habit.</h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Track your trades, analyze your performance, and become a more profitable trader with our comprehensive suite of tools.
        </p>
      </div>
      
      {/* App Screenshot with Enhanced Image Quality */}
      <div className="relative w-full max-w-5xl mx-auto mb-8">
        <div className="w-full rounded-lg overflow-hidden">
          <img 
            src="/lovable-uploads/da846476-9055-4a83-97db-8b1e1202f77b.png" 
            alt="Trading Journal Dashboard" 
            className="w-full object-cover object-center" 
            loading="eager"
            style={{ imageRendering: 'crisp-edges' }}
          />
          {/* Shadow overlay that fades into the background */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90 pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.2),inset_0_-40px_40px_rgba(0,0,0,0.3)] pointer-events-none"></div>
        </div>
        
        {/* Buttons positioned on top of the faded area */}
        <div className="absolute bottom-[5rem] left-0 right-0 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="gap-2 text-lg">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg">
            View Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
