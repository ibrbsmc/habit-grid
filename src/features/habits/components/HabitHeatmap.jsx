import {
  getDatesInYear,
  getShortMonthName,
  groupDatesByWeek,
} from "@/lib/date";

const weekDayLabels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function HabitHeatmap({
  year,
  completedDates = [],
  color,
  dailyAmounts = {},
  target,
}) {
  const yearDates = getDatesInYear(year);
  const yearWeeks = groupDatesByWeek(yearDates);

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold">{year} yılı</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        {yearDates.length} günlük takip görünümü
      </p>

      <div className="mt-4 overflow-x-auto pb-2">
        <div className="flex w-max">
          <div className="mr-2 mt-5 flex flex-col gap-1" aria-hidden="true">
            {weekDayLabels.map((day) => (
              <div
                key={day}
                className="flex h-3 w-6 items-center text-[10px] text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          <div>
            <div className="mb-1 flex h-4 gap-1" aria-hidden="true">
              {yearWeeks.map((week, weekIndex) => {
                const firstDateOfMonth = week.find((date) =>
                  date?.endsWith("-01"),
                );

                return (
                  <div key={weekIndex} className="relative w-3 shrink-0">
                    {firstDateOfMonth && (
                      <span className="absolute left-0 whitespace-nowrap text-[10px] text-muted-foreground">
                        {getShortMonthName(firstDateOfMonth)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              className="flex gap-1"
              aria-label={`${year} yılı alışkanlık takip görünümü`}
            >
              {yearWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((date, dayIndex) => {
                    if (!date) {
                      return (
                        <div
                          key={`empty-${dayIndex}`}
                          className="size-3"
                          aria-hidden="true"
                        />
                      );
                    }

                    const isCompleted = completedDates.includes(date);

                    const dailyAmount = dailyAmounts[date] ?? 0; // Ör. dailyAmounts["2026-08-11"];

                    let intensity = isCompleted ? 1 : 0; // Hücrenin renk yoğunluğu

                    if (target && dailyAmount > 0) {
                      intensity = Math.min(dailyAmount / target.amount, 1);
                    }
                    return (
                      <div key={date} className="group relative size-3">
                        <div
                          className={`size-3 rounded-sm ${
                            intensity === 0 ? "bg-muted" : ""
                          }`}
                          style={
                            intensity > 0
                              ? {
                                  backgroundColor: color,
                                  opacity: 0.25 + intensity * 0.75,
                                }
                              : undefined
                          }
                        />

                        <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md group-hover:block">
                          {target
                            ? `${date}: ${dailyAmount} / ${target.amount} ${target.unit}`
                            : `${date}: ${
                                isCompleted ? "Tamamlandı" : "Tamamlanmadı"
                              }`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {target ? (
        <div className="mt-3 flex items-center justify-end gap-1">
          <span className="mr-1 text-xs text-muted-foreground">Az</span>

          <span className="size-3 rounded-sm bg-muted" />

          {[0.25, 0.5, 0.75, 1].map((opacity) => (
            <span
              key={opacity}
              className="size-3 rounded-sm"
              style={{
                backgroundColor: color,
                opacity,
              }}
            />
          ))}

          <span className="ml-1 text-xs text-muted-foreground">Hedef</span>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-end gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="size-3 rounded-sm bg-muted" />
            <span>Tamamlanmadı</span>
          </div>

          <div className="flex items-center gap-1">
            <span
              className="size-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span>Tamamlandı</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitHeatmap;
