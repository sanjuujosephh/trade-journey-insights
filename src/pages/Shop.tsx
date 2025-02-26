
import { StrategiesTab } from "@/components/strategies/StrategiesTab";
import { PageLayout } from "@/components/layout/PageLayout";

export default function Shop() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto">
          <StrategiesTab />
        </main>
      </div>
    </PageLayout>
  );
}

