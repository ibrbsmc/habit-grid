import { formatDate, getPreviousDate } from "@/lib/date";

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

// Son 7 günün tamamlanma oranını hesaplar.
export function getLastSevenDaysRate(completedDates = []) {
  const currentDate = new Date();
  let completedDayCount = 0;

  // Bugün dahil son 7 günü geriye doğru kontrol et.
  for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
    const date = formatDate(currentDate);

    if (completedDates.includes(date)) {
      completedDayCount += 1;
    }

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return Math.round((completedDayCount / 7) * 100);
}

export function getLongestStreak(completedDates = []) {
  if (completedDates.length === 0) {
    return 0;
  }

  const sortedDates = [...completedDates].sort();

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
