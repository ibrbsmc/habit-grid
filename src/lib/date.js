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
