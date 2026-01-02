import { Separator } from "@/components/ui/separator";

async function DashboardPage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Finances Perso.</h1>
        <p className="text-stone-500">
          Les finances personnelles de ton workspace
        </p>
      </div>
      <Separator />
    </div>
  );
}

export default DashboardPage;
