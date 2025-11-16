import { Information } from "../components/information";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";

export default async function Home() {
  return (
    <div className="relative">
      <main className="bg-white max-w-7xl container mx-auto">
        <Information />
        <Header />
        <Hero />
      </main>
    </div>
  );
}
