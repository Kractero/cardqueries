import Link from "next/link";
import Docs from "./docs.mdx";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <div className="mt-2 mb-10 text-center">
        <div className="mt-2 mb-10 text-center">
          <h1 className="text-7xl my-2 tracking-tight">
            Card <span className="text-purple-700">Queries</span>
          </h1>
          <Link href="/">
            <Button className="rounded-md text-sm font-medium px-4 py-2 my-2">
              <Home />
            </Button>
          </Link>
        </div>
        <Link
          className="mt-3 mb-6 transition-colors duration-300 hover:text-purple-700"
          href="https://api.sideroca.com/cards"
        >
          https://api.sideroca.com/cards
        </Link>
      </div>
      <div className="prose dark:prose-invert mx-auto mb-36 max-w-[300px] phone:max-w-5xl">
        <Docs />
      </div>
    </main>
  );
}
