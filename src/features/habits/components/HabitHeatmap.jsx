import {
  getDatesInYear,
  getShortMonthName,
  groupDatesByWeek,
} from "@/lib/date";
import { cn } from "@/lib/utils";

const weekDayLabels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function HabitHeatmap({
  year,
  completedDates = [],
  color,
  dailyAmounts = {},
  target,
  className,
  compact = false,
}) {
  const yearDates = getDatesInYear(year);
  const yearWeeks = groupDatesByWeek(yearDates);

  return (
    <div className={cn(className)}>
      <div
        className={compact ? "overflow-hidden pb-2" : "overflow-x-auto pb-2"}
      >
        {" "}
        <div className="mx-auto flex w-max">
          {" "}
          <div className="mr-3 mt-6 flex flex-col gap-1" aria-hidden="true">
            {weekDayLabels.map((day) => (
              <div
                key={day}
                className={cn(
                  "flex w-7 items-center text-muted-foreground",
                  compact ? "h-3 text-[10px]" : "h-4 text-xs",
                )}
              >
                {day}
              </div>
            ))}
          </div>
          <div>
            <div className="mb-1 flex h-5 gap-1" aria-hidden="true">
              {yearWeeks.map((week, weekIndex) => {
                const firstDateOfMonth = week.find((date) =>
                  date?.endsWith("-01"),
                );

                return (
                  <div
                    key={weekIndex}
                    className={cn("relative shrink-0", compact ? "w-3" : "w-4")}
                  >
                    {firstDateOfMonth && (
                      <span className="absolute left-0 whitespace-nowrap text-xs text-muted-foreground">
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
                          className={compact ? "size-3" : "size-4"}
                          aria-hidden="true"
                        />
                      );
                    }

                    const isCompleted = completedDates.includes(date);
                    const dailyAmount = dailyAmounts[date] ?? 0;

                    let intensity = isCompleted ? 1 : 0;

                    if (target && dailyAmount > 0) {
                      intensity = Math.min(dailyAmount / target.amount, 1);
                    }

                    const tooltipText = target
                      ? `${date}: ${dailyAmount} / ${target.amount} ${target.unit}`
                      : `${date}: ${
                          isCompleted ? "Tamamlandı" : "Tamamlanmadı"
                        }`;

                    return (
                      <div
                        key={date}
                        className={cn(
                          "rounded-sm",
                          compact ? "size-3" : "size-4",
                          intensity === 0 && "bg-muted",
                        )}
                        style={
                          intensity > 0
                            ? {
                                backgroundColor: color,
                                opacity: 0.25 + intensity * 0.75,
                              }
                            : undefined
                        }
                        title={tooltipText}
                        aria-label={tooltipText}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {target ? (
        <div className="mt-3 flex items-center justify-center gap-1">
          <span className="mr-1 text-xs text-muted-foreground">Az</span>

          <span className="size-4 rounded-sm bg-muted" />

          {[0.25, 0.5, 0.75, 1].map((opacity) => (
            <span
              key={opacity}
              className="size-4 rounded-sm"
              style={{
                backgroundColor: color,
                opacity,
              }}
            />
          ))}

          <span className="ml-1 text-xs text-muted-foreground">Hedef</span>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="size-4 rounded-sm bg-muted" />
            <span>Tamamlanmadı</span>
          </div>

          <div className="flex items-center gap-1">
            <span
              className="size-4 rounded-sm"
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
