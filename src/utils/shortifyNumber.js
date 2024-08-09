export default function shortifyNumber(number) {
  number = parseFloat(number)

  if (number > 0 && number < 1) {
    return "<1"
  }

  if (number < 1000) {
    return number.toString();
  }

  const units = ['K', 'M', 'B', 'T', 'Q'];

  let unitIndex = -1;
  let shortNumber = number;

  while (shortNumber >= 1000 && unitIndex < units.length - 1) {
    shortNumber /= 1000;
    unitIndex++;
  }

  return `${shortNumber.toFixed(0)}${units[unitIndex]}`;
}