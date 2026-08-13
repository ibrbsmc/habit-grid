import HabitCard from "@/features/habits/components/HabitCard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { habitIcons } from "@/features/habits/habitOptions";
import { getTodayDate } from "@/lib/date";
import { Plus, Save, X } from "lucide-react";
import { Route, Routes } from "react-router";
import HabitDetailPage from "@/features/habits/HabitDetailPage";

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
  const [usesTarget, setUsesTarget] = useState(false); // miktar hedefinin kullanılıp kullanılmadığı
  const [targetAmount, setTargetAmount] = useState(""); // günlük miktar hedefi
  const [targetUnit, setTargetUnit] = useState(""); // günlük miktar hedefinin birimi
  const [targetError, setTargetError] = useState(""); // günlük miktar hedefi ile ilgili hata mesajı

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

    const numericTargetAmount = Number(targetAmount); // Inputlardan alınan değerler, type="number" olsa bile JavaScript’e genellikle metin olarak gelir.
    const cleanedTargetUnit = targetUnit.trim();

    if (
      // Hedef kullanılıyorsa ve hedef miktar geçerli değilse hata mesajı göster.
      usesTarget &&
      (!targetAmount ||
        !Number.isFinite(numericTargetAmount) ||
        numericTargetAmount <= 0)
    ) {
      setTargetError("Günlük hedef sıfırdan büyük olmalıdır.");
      return;
    }

    if (usesTarget && !cleanedTargetUnit) {
      setTargetError("Hedef birimi boş bırakılamaz.");
      return;
    }

    const target = usesTarget
      ? {
          amount: numericTargetAmount,
          unit: cleanedTargetUnit,
        }
      : null;

    if (editingHabitId) {
      setHabits((currentHabits) =>
        currentHabits.map((habit) =>
          habit.id === editingHabitId
            ? {
                ...habit,
                name: cleanedHabitName,
                color: habitColor,
                icon: habitIcon,
                target,
                dailyAmounts: usesTarget ? (habit.dailyAmounts ?? {}) : {},
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
        completedDates: [],
        target,
        dailyAmounts: {},
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
    setUsesTarget(false);
    setTargetAmount("");
    setTargetUnit("");
    setTargetError("");
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
    const target = habit.target ?? null;
    setUsesTarget(Boolean(target)); // Hedef kullanılıyorsa true, yoksa false
    setTargetAmount(target?.amount ?? "");
    setTargetUnit(target?.unit ?? "");
    setTargetError("");
  }

  function handleToggleToday(habitId) {
    const today = getTodayDate();

    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        const completedDates = habit.completedDates ?? [];
        const isCompletedToday = completedDates.includes(today);

        let updatedCompletedDates;

        if (isCompletedToday) {
          updatedCompletedDates = completedDates.filter(
            (date) => date !== today,
          );
        } else {
          updatedCompletedDates = [...completedDates, today];
        }

        return {
          ...habit,
          completedDates: updatedCompletedDates,
        };
      }),
    );
  }

  function handleUpdateDate(habitId, date, progress) {
    if (!date || date > getTodayDate()) {
      return;
    }

    setHabits((currentHabits) =>
      currentHabits.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        const completedDates = habit.completedDates ?? [];

        if (!habit.target) {
          const isCompleted = Boolean(progress.isCompleted);

          return {
            ...habit,
            completedDates: isCompleted
              ? [...new Set([...completedDates, date])].sort()
              : completedDates.filter(
                  (completedDate) => completedDate !== date,
                ),
          };
        }

        const numericAmount = Number(progress.amount);

        if (!Number.isFinite(numericAmount) || numericAmount < 0) {
          return habit;
        }

        const updatedDailyAmounts = {
          ...(habit.dailyAmounts ?? {}),
        };

        if (progress.amount === "" || numericAmount === 0) {
          delete updatedDailyAmounts[date];
        } else {
          updatedDailyAmounts[date] = numericAmount;
        }

        const hasReachedTarget = numericAmount >= habit.target.amount;

        return {
          ...habit,
          dailyAmounts: updatedDailyAmounts,
          completedDates: hasReachedTarget
            ? [...new Set([...completedDates, date])].sort()
            : completedDates.filter((completedDate) => completedDate !== date),
        };
      }),
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-muted/20">
            <header className="border-b bg-background">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                <div className="flex flex-row items-center gap-2">
                  <img
                    src="/habitGrid-logo.png"
                    width={42}
                    height={42}
                    alt="HabitGrid Logo"
                  />
                  <h1 className="text-xl font-normal text-blue-950">
                    HabitGrid
                  </h1>
                </div>
                <Button
                  className="h-9"
                  onClick={() => {
                    if (isFormOpen) {
                      handleCancel();
                    } else {
                      setIsFormOpen(true);
                    }
                  }}
                >
                  {isFormOpen ? <X /> : <Plus />}
                  {isFormOpen ? "Kapat" : "Alışkanlık Ekle"}
                </Button>
              </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
              {isFormOpen && (
                <section className="mb-6 rounded-xl border bg-background p-4 shadow-xs">
                  <h2 className="text-lg font-normal">
                    {editingHabitId ? "Alışkanlığı düzenle" : "Yeni alışkanlık"}
                  </h2>
                  <form className="mt-4" onSubmit={handleSubmit}>
                    <label className="text-sm font-normal" htmlFor="habit-name">
                      Alışkanlık adı
                    </label>

                    <Input
                      id="habit-name"
                      className="mt-2"
                      placeholder="Örneğin: Kitap Okumak"
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
                      <legend className="text-sm font-normal">
                        Alışkanlık rengi
                      </legend>

                      <div className="mt-2 flex flex-wrap gap-2.5">
                        {habitColors.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            className={`size-8 rounded-full border ${
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
                      <legend className="text-sm font-normal">
                        Alışkanlık simgesi
                      </legend>

                      <div className="mt-2 flex flex-wrap gap-2.5">
                        {habitIcons.map(({ name, value, Icon }) => (
                          <button
                            key={value}
                            type="button"
                            className={`flex size-9 items-center justify-center rounded-lg border ${
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

                    <div className="mt-4">
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          className="mt-1 size-4"
                          checked={usesTarget}
                          onChange={(event) => {
                            setUsesTarget(event.target.checked);
                            setTargetError("");
                          }}
                        />

                        <span>
                          <span className="block text-sm font-normal">
                            Miktar hedefi kullan
                          </span>

                          <span className="block text-sm text-muted-foreground">
                            Günlük sayfa, bardak veya kilometre gibi bir hedef
                            belirle.
                          </span>
                        </span>
                      </label>

                      {usesTarget && (
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div>
                            <label
                              className="text-sm font-normal"
                              htmlFor="target-amount"
                            >
                              Günlük hedef
                            </label>

                            <Input
                              id="target-amount"
                              type="number"
                              min="0"
                              step="any"
                              className="mt-2"
                              placeholder="Örneğin: 20"
                              value={targetAmount}
                              onChange={(event) => {
                                setTargetAmount(event.target.value);
                                setTargetError("");
                              }}
                              aria-invalid={Boolean(targetError)}
                            />
                          </div>

                          <div>
                            <label
                              className="text-sm font-normal"
                              htmlFor="target-unit"
                            >
                              Birim
                            </label>

                            <Input
                              id="target-unit"
                              className="mt-2"
                              placeholder="Örneğin: Sayfa"
                              value={targetUnit}
                              onChange={(event) => {
                                setTargetUnit(event.target.value);
                                setTargetError("");
                              }}
                              aria-invalid={Boolean(targetError)}
                            />
                          </div>
                        </div>
                      )}

                      {targetError && (
                        <p className="mt-2 text-sm text-destructive">
                          {targetError}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button type="submit">
                        <Save />
                        {editingHabitId ? "Değişiklikleri Kaydet" : "Kaydet"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        İptal
                      </Button>
                    </div>
                  </form>
                </section>
              )}

              <section>
                <h2 className="text-xl">Alışkanlıklarım</h2>

                {habits.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-dashed bg-background px-5 py-12 text-center">
                    <h3 className="font-normal">Henüz alışkanlık eklenmedi</h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Takip etmeye başlamak için ilk alışkanlığını oluştur.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {habits.map((habit) => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onToggleToday={handleToggleToday}
                        onUpdateDate={handleUpdateDate}
                      />
                    ))}
                  </div>
                )}
              </section>
            </main>
          </div>
        }
      />
      <Route
        path="/aliskanliklar/:habitId"
        element={
          <HabitDetailPage habits={habits} onUpdateDate={handleUpdateDate} />
        }
      />
    </Routes>
  );
}

export default App;
