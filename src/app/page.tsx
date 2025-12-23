import { Button } from "@/components/ui/button";
import { getCurrent } from "@/features/auth/actions";
import LogoutButton from "@/features/auth/components/logout-button";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();
  if (!user) redirect("/login");

  return <div >Only visible to logged in users
    <LogoutButton />
  </div>;
}
