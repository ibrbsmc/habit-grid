import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTodayDate } from "@/lib/date";
import { useState } from "react";

function HabitTodayAmountForm({ habit, onUpdateDate }) {
  const today = getTodayDate();
  const [amount, setAmount] = useState(habit.dailyAmounts?.[today] ?? "");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const numericAmount = Number(amount);
  const progressAmount =
    amount !== "" && Number.isFinite(numericAmount) && numericAmount >= 0
      ? numericAmount
      : 0;
  const progressRate = Math.min(
    Math.round((progressAmount / habit.target.amount) * 100),
    100,
  );
  const isTargetReached = progressAmount >= habit.target.amount;

  function handleSubmit(event) {
    event.preventDefault();

    if (amount !== "" && (!Number.isFinite(numericAmount) || numericAmount < 0)) {
      setError("Miktar sıfır veya daha büyük olmalıdır.");
      return;
    }

    onUpdateDate(habit.id, today, { amount });
    setError("");
    setMessage(
      amount === "" || numericAmount === 0
        ? "Bugünkü kayıt kaldırıldı."
        : "Bugünkü miktar kaydedildi.",
    );
  }

  return (
    <section className="mt-6 rounded-xl border bg-muted/30 p-5">
      <h2 className="text-lg font-semibold">Bugünün kaydı</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Bugün yaptığın miktarı gir ve ilerlemeni kaydet.
      </p>

      <form className="mt-4" onSubmit={handleSubmit}>
        <label className="text-sm font-medium" htmlFor="today-amount">
          Bugünkü miktar
        </label>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2">
            <Input
              id="today-amount"
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setError("");
                setMessage("");
              }}
              aria-invalid={Boolean(error)}
            />

            <span className="shrink-0 text-sm text-muted-foreground">
              {habit.target.unit}
            </span>
          </div>

          <Button type="submit">Bugünkü kaydı kaydet</Button>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progressRate}%`,
              backgroundColor: habit.color,
            }}
          />
        </div>

        <p
          className={`mt-2 text-sm ${
            isTargetReached
              ? "font-medium text-emerald-600"
              : "text-muted-foreground"
          }`}
        >
          {isTargetReached
            ? `Günlük hedef tamamlandı: ${progressAmount} ${habit.target.unit}`
            : `İlerleme: ${progressAmount} / ${habit.target.amount} ${habit.target.unit}`}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Alanı boş bırakıp kaydedersen bugünkü miktar kaydı kaldırılır.
        </p>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        {message && (
          <p
            className="mt-3 text-sm font-medium text-emerald-600"
            aria-live="polite"
          >
            {message}
          </p>
        )}
      </form>
    </section>
  );
}

export default HabitTodayAmountForm;
