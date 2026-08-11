import {
  getDatesInYear,
  getShortMonthName,
  groupDatesByWeek,
} from "@/lib/date";

const weekDayLabels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function HabitHeatmap({ year, completedDates = [], color }) {
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

                    return (
                      <div
                        key={date}
                        title={`${date} - ${
                          isCompleted ? "Tamamlandı" : "Tamamlanmadı"
                        }`}
                        className={`size-3 rounded-sm ${
                          isCompleted ? "" : "bg-muted"
                        }`}
                        style={
                          isCompleted ? { backgroundColor: color } : undefined
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HabitHeatmap;
