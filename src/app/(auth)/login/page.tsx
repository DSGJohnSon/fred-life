import { getCurrent } from "@/features/auth/actions";
import { LoginForm } from "@/features/auth/components/forms/login-form";
import { redirect } from "next/navigation";

async function Page() {
  const user = await getCurrent();
  if (user) redirect("/hello");

  return <LoginForm />;
}

export default Page;
