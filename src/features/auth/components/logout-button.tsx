"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "../api/use-logout";

function LogoutButton({ className }: { className?: string }) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Button onClick={() => logout()} disabled={isPending} className={className}>
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}

export default LogoutButton;
