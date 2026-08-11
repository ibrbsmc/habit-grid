import HabitHeatmap from "@/features/habits/components/HabitHeatmap";
import { getDatesInYear, getStartOfWeek, getTodayDate } from "@/lib/date";
import { useParams } from "react-router";
import { getCurrentStreak, getLongestStreak } from "@/lib/habitStats";

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
  const longestStreak = getLongestStreak(completedDates);

  const yearDates = getDatesInYear(selectedYear);
  const today = getTodayDate();

  const trackedDates = yearDates.filter((date) => date <= today);
  const weekStartDate = getStartOfWeek(today);
  const currentMonth = today.slice(0, 7);

  const weekDates = trackedDates.filter((date) => date >= weekStartDate);

  const monthDates = trackedDates.filter((date) =>
    date.startsWith(currentMonth),
  );

  const completedDayCount = trackedDates.filter((date) =>
    completedDates.includes(date),
  ).length;

  const completedDateSet = new Set(completedDates);

  const weeklyCompletedDayCount = weekDates.filter((date) =>
    completedDateSet.has(date),
  ).length;

  const monthlyCompletedDayCount = monthDates.filter((date) =>
    completedDateSet.has(date),
  ).length;

  const weeklySuccessRate =
    weekDates.length > 0
      ? Math.round((weeklyCompletedDayCount / weekDates.length) * 100)
      : 0;

  const monthlySuccessRate =
    monthDates.length > 0
      ? Math.round((monthlyCompletedDayCount / monthDates.length) * 100)
      : 0;

  const yearlySuccessRate =
    trackedDates.length > 0
      ? Math.round((completedDayCount / trackedDates.length) * 100)
      : 0;

  return (
    <div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-3">
          <div
            className="size-4 shrink-0 rounded-full"
            style={{ backgroundColor: habit.color }}
          />

          <h1 className="text-2xl font-bold">{habit.name}</h1>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">En uzun seri</p>

            <p className="mt-1 text-2xl font-semibold">{longestStreak} gün</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Bu yıl tamamlanan</p>

            <p className="mt-1 text-2xl font-semibold">
              {completedDayCount} gün
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Haftalık başarı</p>

            <p className="mt-1 text-2xl font-semibold">%{weeklySuccessRate}</p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Aylık başarı</p>

            <p className="mt-1 text-2xl font-semibold">%{monthlySuccessRate}</p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Yıllık başarı</p>

            <p className="mt-1 text-2xl font-semibold">%{yearlySuccessRate}</p>
          </div>
        </div>

        <HabitHeatmap
          year={selectedYear}
          completedDates={completedDates}
          color={habit.color}
          dailyAmounts={habit.dailyAmounts ?? {}}
          target={habit.target}
        />
      </div>
    </div>
  );
}

export default HabitDetailPage;
