import HabitExportPanel from "@/features/habits/components/HabitExportPanel";
import HabitHeatmap from "@/features/habits/components/HabitHeatmap";
import HabitHistoryEditor from "@/features/habits/components/HabitHistoryEditor";
import HabitTodayAmountForm from "@/features/habits/components/HabitTodayAmountForm";
import { habitIcons } from "@/features/habits/habitOptions";
import { getDatesInYear, getStartOfWeek, getTodayDate } from "@/lib/date";
import {
  getCurrentStreak,
  getLongestStreak,
  getMostSuccessfulDay,
  getMostSuccessfulWeek,
} from "@/lib/habitStats";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";

function formatWeekRange(week) {
  if (!week) {
    return "Henüz yok";
  }

  const startDate = new Date(`${week.startDate}T00:00:00Z`);
  const endDate = new Date(`${week.endDate}T00:00:00Z`);

  const formattedStartDate = startDate.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

  const formattedEndDate = endDate.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return `${formattedStartDate} – ${formattedEndDate} (${week.count} gün)`;
}

function StatisticItem({ label, value }) {
  return (
    <div className="px-3 py-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}

function HabitDetailPage({ habits, onUpdateDate }) {
  const { habitId } = useParams();
  const habit = habits.find((habit) => String(habit.id) === habitId);

  if (!habit) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="rounded-xl border bg-background p-5">
          <h1 className="text-xl font-normal">Alışkanlık bulunamadı</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Görüntülemek istediğiniz alışkanlık mevcut değil.
          </p>
        </div>
      </main>
    );
  }

  const HabitIcon =
    habitIcons.find((icon) => icon.value === habit.icon)?.Icon ??
    habitIcons[0].Icon;

  const completedDates = habit.completedDates ?? [];
  const totalCompletedDays = completedDates.length;
  const currentStreak = getCurrentStreak(completedDates);
  const longestStreak = getLongestStreak(completedDates);
  const mostSuccessfulDay = getMostSuccessfulDay(completedDates);
  const mostSuccessfulWeek = getMostSuccessfulWeek(completedDates);

  const selectedYear = new Date().getFullYear();
  const today = getTodayDate();
  const trackedDates = getDatesInYear(selectedYear).filter(
    (date) => date <= today,
  );
  const weekStartDate = getStartOfWeek(today);
  const currentMonth = today.slice(0, 7);
  const completedDateSet = new Set(completedDates);

  const weekDates = trackedDates.filter((date) => date >= weekStartDate);
  const monthDates = trackedDates.filter((date) =>
    date.startsWith(currentMonth),
  );
  const completedDayCount = trackedDates.filter((date) =>
    completedDateSet.has(date),
  ).length;
  const weeklyCompletedDayCount = weekDates.filter((date) =>
    completedDateSet.has(date),
  ).length;
  const monthlyCompletedDayCount = monthDates.filter((date) =>
    completedDateSet.has(date),
  ).length;

  const weeklySuccessRate = Math.round(
    (weeklyCompletedDayCount / weekDates.length) * 100,
  );
  const monthlySuccessRate = Math.round(
    (monthlyCompletedDayCount / monthDates.length) * 100,
  );
  const yearlySuccessRate = Math.round(
    (completedDayCount / trackedDates.length) * 100,
  );

  const bestDayText = mostSuccessfulDay
    ? `${mostSuccessfulDay.name} (${mostSuccessfulDay.count} kez)`
    : "Henüz yok";
  const bestWeekText = formatWeekRange(mostSuccessfulWeek);

  const exportStatistics = {
    totalCompletedDays,
    currentStreak,
    longestStreak,
    yearlySuccessRate,
    bestDayText,
    bestWeekText,
  };

  return (
    <div className="min-h-screen bg-transparent">
      {" "}
      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
        <Link
          to="/"
          className="-ml-2 mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-normal text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft />
          Geri
        </Link>

        <div className="grid items-start gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex min-w-0 items-center gap-3">
            <HabitIcon
              className="size-7 shrink-0"
              style={{ color: habit.color }}
              strokeWidth={2}
            />

            <h1 className="truncate text-xl font-normal tracking-tight sm:text-2xl">
              {habit.name}
            </h1>
          </div>

          <HabitHistoryEditor
            key={habit.id}
            habit={habit}
            onUpdateDate={onUpdateDate}
          />
        </div>

        <section className="mt-5 rounded-xl border bg-background p-3 shadow-xs sm:p-4">
          <HabitHeatmap
            year={selectedYear}
            completedDates={completedDates}
            color={habit.color}
            dailyAmounts={habit.dailyAmounts ?? {}}
            target={habit.target}
          />
        </section>

        <div
          className={`mt-4 grid gap-4 ${
            habit.target ? "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]" : ""
          }`}
        >
          {habit.target && (
            <HabitTodayAmountForm
              key={habit.id}
              habit={habit}
              onUpdateDate={onUpdateDate}
            />
          )}

          <section className="overflow-hidden rounded-xl border bg-background shadow-xs">
            <h2 className="px-3 pt-3 text-base font-normal">İstatistik</h2>

            <div className="mt-2 grid divide-y sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              <StatisticItem
                label="Toplam tamamlanan"
                value={`${totalCompletedDays} gün`}
              />
              <StatisticItem
                label="Mevcut seri"
                value={`${currentStreak} gün`}
              />
              <StatisticItem
                label="En uzun seri"
                value={`${longestStreak} gün`}
              />
              <StatisticItem
                label="Bu yıl tamamlanan"
                value={`${completedDayCount} gün`}
              />
            </div>

            <div className="grid divide-y border-t sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <StatisticItem
                label="Haftalık başarı"
                value={`%${weeklySuccessRate}`}
              />
              <StatisticItem
                label="Aylık başarı"
                value={`%${monthlySuccessRate}`}
              />
              <StatisticItem
                label="Yıllık başarı"
                value={`%${yearlySuccessRate}`}
              />
            </div>

            <div className="grid divide-y border-t sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <StatisticItem label="En başarılı gün" value={bestDayText} />
              <StatisticItem label="En başarılı hafta" value={bestWeekText} />
            </div>
          </section>
        </div>

        <HabitExportPanel
          habit={habit}
          year={selectedYear}
          statistics={exportStatistics}
        />
      </main>
    </div>
  );
}

export default HabitDetailPage;
