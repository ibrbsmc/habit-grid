import HabitCard from "@/features/habits/components/HabitCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function App() {
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedHabitName = habitName.trim();

    if (!cleanedHabitName) {
      setError("Alışkanlık adı boş olamaz.");
      return;
    }

    const habitAlreadyExists = habits.some(
      (habit) =>
        habit.name.toLocaleLowerCase("tr-TR") ===
        cleanedHabitName.toLocaleLowerCase("tr-TR"),
    );

    if (habitAlreadyExists) {
      setError("Bu alışkanlık zaten mevcut.");
      return;
    }

    const newHabit = {
      id: crypto.randomUUID(),
      name: cleanedHabitName,
    };

    setHabits((currentHabits) => [...currentHabits, newHabit]);
    setHabitName("");
    setError("");
    setIsFormOpen(false);
  }

  function handleCancel() {
    setHabitName("");
    setError("");
    setIsFormOpen(false);
  }

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

          <Button
            onClick={() => {
              if (isFormOpen) {
                handleCancel();
              } else {
                setIsFormOpen(true);
              }
            }}
          >
            {isFormOpen ? "Formu kapat" : "Alışkanlık ekle"}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {isFormOpen && (
          <section className="mb-8 rounded-xl border bg-background p-5">
            <h2 className="text-lg font-semibold">Yeni alışkanlık</h2>

            <form className="mt-4" onSubmit={handleSubmit}>
              <label className="text-sm font-medium" htmlFor="habit-name">
                Alışkanlık adı
              </label>

              <Input
                id="habit-name"
                className="mt-2"
                placeholder="Örneğin: Kitap okumak"
                value={habitName}
                onChange={(event) => {
                  setHabitName(event.target.value);
                  setError("");
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "habit-name-error" : undefined}
                autoFocus
              />

              {error && (
                <p
                  id="habit-name-error"
                  className="mt-2 text-sm text-destructive"
                >
                  {error}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <Button type="submit">Kaydet</Button>

                <Button type="button" variant="outline" onClick={handleCancel}>
                  İptal
                </Button>
              </div>
            </form>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold">Alışkanlıklarım</h2>

          {habits.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed bg-background px-6 py-16 text-center">
              <h3 className="font-medium">Henüz alışkanlık eklenmedi</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Takip etmeye başlamak için ilk alışkanlığını oluştur.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {habits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
