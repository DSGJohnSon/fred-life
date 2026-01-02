import { Button } from "@/components/ui/button";
import Link from "next/link";

function AccountPage() {
  return (
    <div className="flex gap-2 h-screen w-screen items-center justify-center">
      <Button asChild>
        <Link href="/account">Account</Link>
      </Button>
      <Button asChild>
        <Link href="/account/history">History</Link>
      </Button>
    </div>
  );
}

export default AccountPage;
