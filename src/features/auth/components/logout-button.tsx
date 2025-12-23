"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "../api/use-logout";

function LogoutButton() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Button onClick={() => logout()} disabled={isPending}>
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}

export default LogoutButton;
