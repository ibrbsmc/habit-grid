import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { habitIcons } from "@/features/habits/habitOptions";
import { getTodayDate } from "@/lib/date";
import { getCurrentStreak, getLastSevenDaysRate } from "@/lib/habitStats";
import { Link } from "react-router";

function HabitCard({ habit, onDelete, onEdit, onToggleToday }) {
  const HabitIcon =
    habitIcons.find((icon) => icon.value === habit.icon)?.Icon ??
    habitIcons[0].Icon;

  const today = getTodayDate();
  const isCompletedToday = (habit.completedDates ?? []).includes(today);
  const totalCompletedDays = (habit.completedDates ?? []).length;
  const currentStreak = getCurrentStreak(habit.completedDates);
  const lastSevenDaysRate = getLastSevenDaysRate(habit.completedDates);
  const todayAmount = habit.dailyAmounts?.[today] ?? "";

  return (
    <article className="rounded-xl border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <Link
          to={`/aliskanliklar/${habit.id}`}
          className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div>
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                style={{ color: habit.color ?? "#2563eb" }}
              >
                <HabitIcon size={19} />
              </span>

              <h3 className="font-semibold">{habit.name}</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Toplam {totalCompletedDays} gün tamamlandı. <br /> Mevcut seri:{" "}
              {currentStreak} gün <br /> Son hafta: %{lastSevenDaysRate}
            </p>
          </div>
        </Link>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(habit)}
          >
            Düzenle
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" size="sm">
                Sil
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Alışkanlık silinsin mi?</AlertDialogTitle>

                <AlertDialogDescription>
                  “{habit.name}” alışkanlığı kalıcı olarak silinecek. Bu işlem
                  geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>

                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={() => onDelete(habit.id)}
                >
                  Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {habit.target ? (
        <div className="mt-4 rounded-lg border bg-muted/30 p-3">
          <p
            className={`text-sm ${
              isCompletedToday
                ? "font-medium text-emerald-600"
                : "text-muted-foreground"
            }`}
          >
            {isCompletedToday
              ? `Bugünkü hedef tamamlandı: ${todayAmount} ${habit.target.unit}`
              : `Bugünkü ilerleme: ${todayAmount || 0} / ${habit.target.amount} ${habit.target.unit}`}
          </p>

          <Link
            to={`/aliskanliklar/${habit.id}`}
            className="mt-3 inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Bugünkü miktarı gir
          </Link>
        </div>
      ) : (
        <Button
          type="button"
          className="mt-4 w-full"
          variant={isCompletedToday ? "outline" : "default"}
          onClick={() => onToggleToday(habit.id)}
        >
          {isCompletedToday
            ? "Bugünün tamamlanmasını kaldır"
            : "Bugünü tamamla"}
        </Button>
      )}
    </article>
  );
}

export default HabitCard;
