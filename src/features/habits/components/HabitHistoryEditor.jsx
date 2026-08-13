import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPreviousDate, getTodayDate } from "@/lib/date";
import { Pencil, Save, X } from "lucide-react";
import { useState } from "react";

function HabitHistoryEditor({ habit, onUpdateDate }) {
  const today = getTodayDate();
  const lastPastDate = getPreviousDate(today);
  const completedDates = habit.completedDates ?? [];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(lastPastDate);
  const [isCompleted, setIsCompleted] = useState(
    completedDates.includes(lastPastDate),
  );
  const [amount, setAmount] = useState(
    habit.dailyAmounts?.[lastPastDate] ?? "",
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleOpen() {
    setSelectedDate(lastPastDate);
    setIsCompleted(completedDates.includes(lastPastDate));
    setAmount(habit.dailyAmounts?.[lastPastDate] ?? "");
    setError("");
    setMessage("");
    setIsOpen(true);
  }

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

    if (!selectedDate || selectedDate > lastPastDate) {
      setError("Yalnızca geçmiş bir tarih düzenlenebilir.");
      return;
    }

    if (habit.target) {
      const numericAmount = Number(amount);

      if (
        amount !== "" &&
        (!Number.isFinite(numericAmount) || numericAmount < 0)
      ) {
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

  if (!isOpen) {
    return (
      <div>
        <Button
          type="button"
          variant="outline"
          className="h-9"
          onClick={handleOpen}
        >
          <Pencil />
          Geçmişi Düzenle
        </Button>
      </div>
    );
  }

  return (
    <section className="col-span-full mt-2 rounded-xl border bg-background p-4 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-normal">Kayıt geçmişini düzenle</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Kaçırdığın veya yanlış kaydettiğin bir günü güncelleyebilirsin.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
        >
          <X />
          Kapat
        </Button>
      </div>

      <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-normal" htmlFor="history-date">
            Tarih
          </label>

          <Input
            id="history-date"
            type="date"
            max={lastPastDate}
            className="mt-2"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        {habit.target ? (
          <div>
            <label className="text-sm font-normal" htmlFor="history-amount">
              İlerleme
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
          </div>
        ) : (
          <label className="flex items-center gap-2.5 self-end rounded-lg border px-3 py-2.5">
            <input
              type="checkbox"
              className="size-4"
              checked={isCompleted}
              onChange={(event) => {
                setIsCompleted(event.target.checked);
                setMessage("");
              }}
            />

            <span className="text-sm font-normal">Bu gün tamamlandı</span>
          </label>
        )}

        <div className="sm:col-span-2">
          {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

          {message && (
            <p className="mb-3 text-sm font-medium text-emerald-600">
              {message}
            </p>
          )}

          <Button type="submit">
            <Save />
            Güncelle
          </Button>
        </div>
      </form>
    </section>
  );
}

export default HabitHistoryEditor;
