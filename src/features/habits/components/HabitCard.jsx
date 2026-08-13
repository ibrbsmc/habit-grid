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
import HabitTodayAmountForm from "@/features/habits/components/HabitTodayAmountForm";
import { habitIcons } from "@/features/habits/habitOptions";
import { getTodayDate } from "@/lib/date";
import { getCurrentStreak } from "@/lib/habitStats";
import { Eye, Flame, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";

function HabitCard({ habit, onDelete, onEdit, onToggleToday, onUpdateDate }) {
  const HabitIcon =
    habitIcons.find((icon) => icon.value === habit.icon)?.Icon ??
    habitIcons[0].Icon;

  const today = getTodayDate();
  const isCompletedToday = (habit.completedDates ?? []).includes(today);
  const currentStreak = getCurrentStreak(habit.completedDates);
  const habitColor = habit.color ?? "#2563eb";

  return (
    <article className="rounded-xl border bg-background p-3.5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <Link
          to={`/aliskanliklar/${habit.id}`}
          className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center"
            style={{ color: habitColor }}
          >
            <HabitIcon size={22} strokeWidth={1.8} />
          </span>

          <h3 className="truncate text-base font-normal">
            {habit.name}
          </h3>
        </Link>

        <div className="flex shrink-0 gap-1.5">
          <Button
            render={<Link to={`/aliskanliklar/${habit.id}`} />}
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs"
          >
            <Eye />
            <span className="hidden sm:inline">Detay</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs"
            onClick={() => onEdit(habit)}
          >
            <Pencil />
            <span className="hidden sm:inline">Düzenle</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs"
              >
                <Trash2 />
                <span className="hidden sm:inline">Sil</span>
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
                  <Trash2 />
                  Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className="flex size-7 shrink-0 items-center justify-center"
          style={{ color: habitColor }}
        >
          <Flame size={19} strokeWidth={1.8} />
        </span>

        <div>
          <p className="text-xs font-normal text-muted-foreground">
            Mevcut seri
          </p>
          <p
            className="text-base font-normal leading-tight"
            style={{ color: habitColor }}
          >
            {currentStreak} gün
          </p>
        </div>
      </div>

      {habit.target ? (
        <HabitTodayAmountForm
          className="mt-3"
          habit={habit}
          onUpdateDate={onUpdateDate}
        />
      ) : (
        <div className="mt-3 rounded-lg p-2.5">
          <p className="text-xs font-normal text-muted-foreground">
            Günlük ilerleme
          </p>

          <Button
            type="button"
            className="mt-2 h-8 w-full"
            variant={"outline"}
            onClick={() => onToggleToday(habit.id)}
          >
            {isCompletedToday ? "İlerlemeyi kaldır" : "İlerlemeyi tamamla"}
          </Button>
        </div>
      )}
    </article>
  );
}

export default HabitCard;
