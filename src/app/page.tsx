import InputBar from "@/components/InputBar";
import ParentComponent from "@/components/ParentComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-[#232336]">
      <InputBar />
      <ParentComponent />
    </main>
  );
}
