import { Link, useParams } from "react-router";
import { getCurrentStreak, getLastSevenDaysRate } from "@/lib/habitStats";

function HabitDetailPage({ habits }) {
  const { habitId } = useParams();

  const habit = habits.find((habit) => String(habit.id) === habitId);

  if (!habit) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Alışkanlıklara dön
          </Link>

          <section className="mt-6 rounded-xl border bg-background p-6">
            <h1 className="text-2xl font-bold">Alışkanlık bulunamadı</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Bu alışkanlık silinmiş veya geçersiz bir bağlantı açılmış
              olabilir.
            </p>
          </section>
        </div>
      </main>
    );
  }

  const completedDates = habit.completedDates ?? [];

  const totalCompletedDays = completedDates.length;
  const currentStreak = getCurrentStreak(completedDates);
  const lastSevenDaysRate = getLastSevenDaysRate(completedDates);

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Alışkanlıklara dön
        </Link>

        <section className="mt-6 rounded-xl border bg-background p-6">
          <div className="flex items-center gap-3">
            <div
              className="size-4 rounded-full"
              style={{ backgroundColor: habit.color }}
            />

            <h1 className="text-2xl font-bold">{habit.name}</h1>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Toplam tamamlanan</p>

              <p className="mt-1 text-xl font-semibold">
                {totalCompletedDays} gün
              </p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Mevcut seri</p>

              <p className="mt-1 text-xl font-semibold">{currentStreak} gün</p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Son 7 gün</p>

              <p className="mt-1 text-xl font-semibold">%{lastSevenDaysRate}</p>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Yıllık takip görünümü burada gösterilecek.
          </p>
        </section>
      </div>
    </main>
  );
}

export default HabitDetailPage;
