import ThemeToggle from "@/components/theme-toggle";
import FlashcardWidget from "../components/flashcard-widget";

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center ">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <FlashcardWidget />
    </main>
  );
}
