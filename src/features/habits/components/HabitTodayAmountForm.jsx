import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTodayDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Save } from "lucide-react";
import { useState } from "react";

function HabitTodayAmountForm({ habit, onUpdateDate, className }) {
  const today = getTodayDate();
  const inputId = `today-amount-${habit.id}`;
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

  function handleSubmit(event) {
    event.preventDefault();

    if (
      amount !== "" &&
      (!Number.isFinite(numericAmount) || numericAmount < 0)
    ) {
      setError("Miktar sıfır veya daha büyük olmalıdır.");
      return;
    }

    onUpdateDate(habit.id, today, { amount });
    setError("");
    setMessage(
      amount === "" || numericAmount === 0
        ? "Günlük kayıt kaldırıldı."
        : "İlerleme kaydedildi.",
    );
  }

  return (
    <section className={cn("rounded-lg p-3", className)}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-normal text-muted-foreground">
            Günlük ilerleme
          </p>

          <p className="mt-0.5 text-sm font-medium leading-tight">
            {progressAmount} / {habit.target.amount} {habit.target.unit}
          </p>
        </div>

        <span className="text-xs font-normal text-muted-foreground">
          %{progressRate}
        </span>
      </div>

      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${progressRate}%`,
            backgroundColor: habit.color,
          }}
        />
      </div>

      <form className="mt-2.5" onSubmit={handleSubmit}>
        <label
          className="sr-only"
          htmlFor={inputId}
        ></label>

        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <Input
              id={inputId}
              type="number"
              min="0"
              step="any"
              className="h-9 bg-background font-normal text-foreground"
              placeholder="İlerleme gir"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setError("");
                setMessage("");
              }}
              aria-invalid={Boolean(error)}
            />
          </div>

          <Button
            type="submit"
            variant="outline"
            className="h-9 bg-white px-3 text-foreground hover:bg-muted"
          >
            <Save />
            Kaydet
          </Button>
        </div>

        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

        {message && (
          <p
            className="mt-2 text-xs font-medium text-emerald-600"
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
