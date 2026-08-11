import HabitCard from "@/features/habits/components/HabitCard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { habitIcons } from "@/features/habits/habitOptions";

function App() {
  const habitColors = [
    { name: "Mavi", value: "#2563eb" },
    { name: "Yeşil", value: "#16a34a" },
    { name: "Mor", value: "#9333ea" },
    { name: "Turuncu", value: "#ea580c" },
    { name: "Kırmızı", value: "#dc2626" },
  ];

  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem("habit-grid-habits");
    return savedHabits ? JSON.parse(savedHabits) : [];
  });
  const [habitName, setHabitName] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [habitColor, setHabitColor] = useState("#2563eb");
  const [habitIcon, setHabitIcon] = useState("target");

  useEffect(() => {
    localStorage.setItem("habit-grid-habits", JSON.stringify(habits));
  }, [habits]);

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedHabitName = habitName.trim();

    if (!cleanedHabitName) {
      setError("Alışkanlık adı boş bırakılamaz.");
      return;
    }

    const habitAlreadyExists = habits.some(
      (habit) =>
        habit.id !== editingHabitId &&
        habit.name.toLocaleLowerCase("tr-TR") ===
          cleanedHabitName.toLocaleLowerCase("tr-TR"),
    );

    if (habitAlreadyExists) {
      setError("Bu isimde bir alışkanlık zaten bulunuyor.");
      return;
    }

    if (editingHabitId) {
      setHabits((currentHabits) =>
        currentHabits.map((habit) =>
          habit.id === editingHabitId
            ? {
                ...habit,
                name: cleanedHabitName,
                color: habitColor,
                icon: habitIcon,
              }
            : habit,
        ),
      );
    } else {
      const newHabit = {
        id: crypto.randomUUID(),
        name: cleanedHabitName,
        color: habitColor,
        icon: habitIcon,
      };

      setHabits((currentHabits) => [...currentHabits, newHabit]);
    }

    handleCancel();
  }

  function handleCancel() {
    setHabitName("");
    setEditingHabitId(null);
    setError("");
    setIsFormOpen(false);
    setHabitColor("#2563eb"); // habitColor yalnızca formda seçili olan geçici rengi tutar; kartın rengi ise habits dizisindeki habit.color değerinden gelir. Rengi sıfırlamasaydık yeni alışkanlık formu kırmızı seçili olarak açılırdı. Sıfırladığımız için yeni form varsayılan maviyle açılır.
    setHabitIcon("target");
  }

  function handleDelete(habitId) {
    setHabits((currentHabits) =>
      currentHabits.filter((habit) => habit.id !== habitId),
    );
  }

  // Fonksiyona yalnızca ID yerine alışkanlığın tamamını gönderiyoruz çünkü hem habit.id hem de habit.name bilgisine ihtiyacımız var.
  function handleEdit(habit) {
    setEditingHabitId(habit.id);
    setHabitName(habit.name);
    setError("");
    setHabitColor(habit.color ?? "#2563eb"); // Alışkanlığın rengi varsa onu kullanır.
    setHabitIcon(habit.icon ?? "target");
    setIsFormOpen(true);
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
            <h2 className="text-lg font-semibold">
              {editingHabitId ? "Alışkanlığı düzenle" : "Yeni alışkanlık"}
            </h2>
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

              <fieldset className="mt-4">
                <legend className="text-sm font-medium">
                  Alışkanlık rengi
                </legend>

                <div className="mt-2 flex flex-wrap gap-3">
                  {habitColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`h-9 w-9 rounded-full border ${
                        habitColor === color.value
                          ? "ring-2 ring-primary ring-offset-2"
                          : ""
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setHabitColor(color.value)}
                      aria-label={color.name}
                      aria-pressed={habitColor === color.value}
                      title={color.name}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-4">
                <legend className="text-sm font-medium">
                  Alışkanlık simgesi
                </legend>

                <div className="mt-2 flex flex-wrap gap-3">
                  {habitIcons.map(({ name, value, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                        habitIcon === value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground"
                      }`}
                      onClick={() => setHabitIcon(value)}
                      aria-label={`${name} simgesini seç`}
                      aria-pressed={habitIcon === value}
                      title={name}
                    >
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-4 flex gap-2">
                <Button type="submit">
                  {editingHabitId ? "Değişiklikleri kaydet" : "Kaydet"}
                </Button>
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
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
