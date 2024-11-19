import Logo from "@/components/Logo";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-5">
      <Logo hasLogo={true} />
      <SignUp />
    </div>
  );
}
