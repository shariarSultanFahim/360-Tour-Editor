import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          360 Home Tour Creator
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Create, edit, and view immersive 360-degree tours of your property.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/edit">Edit Tour</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/view">View Tour</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
