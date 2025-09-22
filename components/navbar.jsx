import Link from "next/link";
import { isUserLoggedIn } from "@/lib/auth";
import NavBarCustom from "@/components/navBarCustom";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";

export default async function Navbar() {
  const isLoggedIn = await isUserLoggedIn();

  if (isLoggedIn) {
    return <NavBarCustom />;
  }

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-foreground">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}