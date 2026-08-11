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

function HabitCard({ habit, onDelete, onEdit }) {
  const HabitIcon =
    habitIcons.find((icon) => icon.value === habit.icon)?.Icon ??
    habitIcons[0].Icon;
  return (
    <article className="rounded-xl border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
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
            Henüz tamamlanan gün bulunmuyor.
          </p>
        </div>
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
    </article>
  );
}

export default HabitCard;
