/* global BigInt */

import { nonnull } from "../data/strict";

export default function (number, decimals) {
  nonnull(number)
  nonnull(decimals)
  
  const one = 10n ** BigInt(decimals)
  number = parseFloat(parseFloat(BigInt(number) / one))
  // + "." + (BigInt(number) % one))

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