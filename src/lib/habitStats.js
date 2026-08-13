import {
  formatDate,
  getPreviousDate,
  getStartOfWeek,
} from "@/lib/date";

export function getCurrentStreak(completedDates = []) {
  // Seri hesabına bugünden başla.
  const currentDate = new Date();

  // Bugün tamamlanmadıysa mevcut seriyi dünden itibaren kontrol et.
  if (!completedDates.includes(formatDate(currentDate))) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  let currentStreak = 0;

  // Tamamlanan günler kesintisiz devam ettiği sürece geriye doğru say.
  while (completedDates.includes(formatDate(currentDate))) {
    currentStreak += 1;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return currentStreak;
}

export function getLongestStreak(completedDates = []) {
  if (completedDates.length === 0) {
    return 0;
  }

  const sortedDates = [...new Set(completedDates)].sort();

  let longestStreak = 1;
  let currentStreak = 1;

  for (let index = 1; index < sortedDates.length; index++) {
    const currentDate = sortedDates[index];
    const previousCompletedDate = sortedDates[index - 1];

    if (getPreviousDate(currentDate) === previousCompletedDate) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  }

  return longestStreak;
}

export function getMostSuccessfulDay(completedDates = []) {
  if (completedDates.length === 0) {
    return null;
  }

  const dayNames = [
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar",
  ];
  const dayCounts = Array(7).fill(0);

  [...new Set(completedDates)].forEach((date) => {
    const dayIndex = new Date(`${date}T00:00:00Z`).getUTCDay();
    const mondayBasedIndex = dayIndex === 0 ? 6 : dayIndex - 1;

    dayCounts[mondayBasedIndex] += 1;
  });

  const highestCount = Math.max(...dayCounts);
  const bestDayIndex = dayCounts.indexOf(highestCount);

  return {
    name: dayNames[bestDayIndex],
    count: highestCount,
  };
}

export function getMostSuccessfulWeek(completedDates = []) {
  if (completedDates.length === 0) {
    return null;
  }

  const weekCounts = {};

  [...new Set(completedDates)].forEach((date) => {
    const weekStartDate = getStartOfWeek(date);

    weekCounts[weekStartDate] = (weekCounts[weekStartDate] ?? 0) + 1;
  });

  let bestWeekStartDate = null;
  let highestCount = 0;

  Object.entries(weekCounts).forEach(([weekStartDate, count]) => {
    const hasHigherCount = count > highestCount;
    const isMoreRecentTie =
      count === highestCount && weekStartDate > bestWeekStartDate;

    if (hasHigherCount || isMoreRecentTie) {
      bestWeekStartDate = weekStartDate;
      highestCount = count;
    }
  });

  const weekEndDate = new Date(`${bestWeekStartDate}T00:00:00Z`);
  weekEndDate.setUTCDate(weekEndDate.getUTCDate() + 6);

  return {
    startDate: bestWeekStartDate,
    endDate: weekEndDate.toISOString().slice(0, 10),
    count: highestCount,
  };
}
