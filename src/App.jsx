import { Button } from "@/components/ui/button";

function App() {
  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <h1 className="text-3xl font-bold">HabitGrid</h1>

      <p className="mt-2 text-muted-foreground">
        Alışkanlıklarını takip et, ilerlemeni gör.
      </p>

      <Button className="mt-6">Alışkanlık ekle</Button>
    </main>
  );
}

export default App;
