import { Separator } from "@/components/ui/separator";

async function DashboardPage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-stone-500">
          Le tableau de bord de ton workspace
        </p>
      </div>
      <Separator />
    </div>
  );
}

export default DashboardPage;
