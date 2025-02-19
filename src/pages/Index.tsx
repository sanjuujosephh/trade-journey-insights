
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradeEntry from "@/components/TradeEntry";
import Analytics from "@/components/Analytics";
import LearningCenter from "@/components/LearningCenter";

export default function Index() {
  const [activeTab, setActiveTab] = useState("trade-entry");

  return (
    <div className="h-[calc(100vh-4rem)] bg-background">
      <div className="container h-full py-4">
        <header className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Trading Journal</h1>
          <p className="text-muted-foreground mt-1">Track, analyze, and improve your trading performance</p>
        </header>

        <Card className="h-[calc(100%-4.5rem)]">
          <Tabs defaultValue="trade-entry" className="h-full" onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start border-b rounded-none px-6 bg-card">
              <TabsTrigger
                value="trade-entry"
                className="data-[state=active]:bg-background"
              >
                Trade Entry
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-background"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="learning"
                className="data-[state=active]:bg-background"
              >
                Learning Center
              </TabsTrigger>
            </TabsList>
            
            <div className="h-[calc(100%-3rem)]">
              <TabsContent
                value="trade-entry"
                className="mt-0 h-full"
              >
                <TradeEntry />
              </TabsContent>

              <TabsContent
                value="analytics"
                className="mt-0 h-full"
              >
                <Analytics />
              </TabsContent>

              <TabsContent
                value="learning"
                className="mt-0 h-full"
              >
                <LearningCenter />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
