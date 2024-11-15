import Hero from "@/components/Hero";
import NftSection from "@/components/NftSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <NftSection />
      <NftSection title="Trending Collections" />
    </div>
  );
}
