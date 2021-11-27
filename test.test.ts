import { getCountOfControlBits } from "./main";

const test = [
  [1, 2],
  [2, 2],
  [3, 3],
  [4, 3],
  [5, 4],
  [6, 4],
  [7, 4],
  [11, 4],
  [12, 5],
  [15, 5],
  [26, 5],
  [27, 6],
];

test
  .filter(([val, res]) => res !== getCountOfControlBits(val))
  .forEach((hui) => console.log(hui, getCountOfControlBits(hui[0])));
