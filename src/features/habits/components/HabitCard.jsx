import { Button } from "@/components/ui/button";

function HabitCard({ habit, onDelete }) {
  return (
    <article className="rounded-xl border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{habit.name}</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Henüz tamamlanan gün bulunmuyor.
          </p>
        </div>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onDelete(habit.id)}
        >
          Sil
        </Button>
      </div>
    </article>
  );
}

export default HabitCard;
