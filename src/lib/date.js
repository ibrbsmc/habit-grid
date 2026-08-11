// Verilen herhangi bir tarihi biçimlendirir.
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Bugünün tarihini formatDate() kullanarak döndürür.
export function getTodayDate() {
  return formatDate(new Date());
}

export function getDatesInYear(year) {
  const dates = [];
  const currentDate = new Date(year, 0, 1);

  // Yıl değişene kadar her günü diziye ekle.
  while (currentDate.getFullYear() === year) {
    dates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Tarihleri haftalara ayıran fonksiyon
export function groupDatesByWeek(dates = []) {
  if (dates.length === 0) {
    return [];
  }

  const [year, month, day] = dates[0].split("-").map(Number);
  const firstDate = new Date(year, month - 1, day);

  // JavaScript'teki Pazar başlangıcını Pazartesi başlangıcına çevir.
  const firstDayIndex = (firstDate.getDay() + 6) % 7;

  // Yılın ilk gününden önceki boş günleri ekle.
  const calendarDates = [...Array(firstDayIndex).fill(null), ...dates];

  // Son haftayı yedi güne tamamla.
  while (calendarDates.length % 7 !== 0) {
    calendarDates.push(null);
  }

  const weeks = [];

  // Tarihleri yedişerli haftalara ayır.
  for (let index = 0; index < calendarDates.length; index += 7) {
    weeks.push(calendarDates.slice(index, index + 7));
  }

  return weeks;
}

// Ay adını oluşturan fonksiyon
export function getShortMonthName(date) {
  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);

  return parsedDate.toLocaleDateString("tr-TR", {
    month: "short",
  });
}
