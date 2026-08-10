import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">HabitGrid</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Alışkanlıklarını takip et, ilerlemeni gör.
            </p>
          </div>

          <Button>Alışkanlık ekle</Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section>
          <h2 className="text-xl font-semibold">Alışkanlıklarım</h2>

          <div className="mt-4 rounded-xl border border-dashed bg-background px-6 py-16 text-center">
            <h3 className="font-medium">Henüz alışkanlık eklenmedi</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Takip etmeye başlamak için ilk alışkanlığını oluştur.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
