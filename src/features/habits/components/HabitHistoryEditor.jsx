import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPreviousDate, getTodayDate } from "@/lib/date";
import { useState } from "react";

function HabitHistoryEditor({ habit, onUpdateDate }) {
  const today = getTodayDate();
  const initialDate = getPreviousDate(today);
  const completedDates = habit.completedDates ?? [];

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [isCompleted, setIsCompleted] = useState(
    completedDates.includes(initialDate),
  );
  const [amount, setAmount] = useState(
    habit.dailyAmounts?.[initialDate] ?? "",
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleDateChange(event) {
    const date = event.target.value;

    setSelectedDate(date);
    setIsCompleted(completedDates.includes(date));
    setAmount(habit.dailyAmounts?.[date] ?? "");
    setError("");
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedDate || selectedDate > today) {
      setError("Bugünden sonraki bir tarih düzenlenemez.");
      return;
    }

    if (habit.target) {
      const numericAmount = Number(amount);

      if (amount !== "" && (!Number.isFinite(numericAmount) || numericAmount < 0)) {
        setError("Miktar sıfır veya daha büyük olmalıdır.");
        return;
      }

      onUpdateDate(habit.id, selectedDate, { amount });
    } else {
      onUpdateDate(habit.id, selectedDate, { isCompleted });
    }

    setError("");
    setMessage("Kayıt güncellendi.");
  }

  return (
    <section className="mt-8 rounded-xl border p-5">
      <h2 className="text-lg font-semibold">Geçmiş günü düzenle</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Kaçırdığın veya yanlış kaydettiğin bir günü güncelleyebilirsin.
      </p>

      <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium" htmlFor="history-date">
            Tarih
          </label>

          <Input
            id="history-date"
            type="date"
            max={today}
            className="mt-2"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        {habit.target ? (
          <div>
            <label className="text-sm font-medium" htmlFor="history-amount">
              Günlük miktar
            </label>

            <div className="mt-2 flex items-center gap-2">
              <Input
                id="history-amount"
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setError("");
                  setMessage("");
                }}
              />

              <span className="shrink-0 text-sm text-muted-foreground">
                {habit.target.unit}
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {habit.target.amount} {habit.target.unit} hedefine ulaşınca gün
              tamamlandı sayılır. Boş bırakırsan kayıt silinir.
            </p>
          </div>
        ) : (
          <label className="flex items-center gap-3 self-end rounded-lg border px-4 py-3">
            <input
              type="checkbox"
              className="size-4"
              checked={isCompleted}
              onChange={(event) => {
                setIsCompleted(event.target.checked);
                setMessage("");
              }}
            />

            <span className="text-sm font-medium">Bu gün tamamlandı</span>
          </label>
        )}

        <div className="sm:col-span-2">
          {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

          {message && (
            <p className="mb-3 text-sm font-medium text-emerald-600">
              {message}
            </p>
          )}

          <Button type="submit">Kaydı güncelle</Button>
        </div>
      </form>
    </section>
  );
}

export default HabitHistoryEditor;
