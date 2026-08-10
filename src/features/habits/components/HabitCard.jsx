function HabitCard({ habit }) {
  return (
    <article className="rounded-xl border bg-background p-5">
      <h3 className="font-semibold">{habit.name}</h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Henüz tamamlanan gün bulunmuyor.
      </p>
    </article>
  );
}

export default HabitCard;
