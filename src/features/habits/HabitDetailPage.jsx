import HabitHeatmap from "@/features/habits/components/HabitHeatmap";
import { getCurrentStreak } from "@/lib/habitStats";
import { useParams } from "react-router";

function HabitDetailPage({ habits }) {
  const { habitId } = useParams();

  const habit = habits.find((habit) => String(habit.id) === habitId);

  if (!habit) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h1 className="text-xl font-semibold">Alışkanlık bulunamadı</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Görüntülemek istediğiniz alışkanlık mevcut değil.
        </p>
      </div>
    );
  }

  const completedDates = habit.completedDates ?? [];
  const totalCompletedDays = completedDates.length;
  const currentStreak = getCurrentStreak(completedDates);
  const selectedYear = new Date().getFullYear();

  return (
    <div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-3">
          <div
            className="size-4 shrink-0 rounded-full"
            style={{ backgroundColor: habit.color }}
          />

          <div>
            <h1 className="text-2xl font-bold">{habit.name}</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {habit.category}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Toplam tamamlanan</p>

            <p className="mt-1 text-2xl font-semibold">
              {totalCompletedDays} gün
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Mevcut seri</p>

            <p className="mt-1 text-2xl font-semibold">{currentStreak} gün</p>
          </div>
        </div>

        <HabitHeatmap
          year={selectedYear}
          completedDates={completedDates}
          color={habit.color}
        />
      </div>
    </div>
  );
}

export default HabitDetailPage;
