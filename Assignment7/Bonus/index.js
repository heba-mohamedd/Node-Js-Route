var romanToInt = function (s) {
  const roman_numerals = [
    { Symbol: "I", Value: 1 },
    { Symbol: "V", Value: 5 },
    { Symbol: "X", Value: 10 },
    { Symbol: "L", Value: 50 },
    { Symbol: "C", Value: 100 },
    { Symbol: "D", Value: 500 },
    { Symbol: "M", Value: 1000 },
  ];

  const chars = s.split("");
  console.log(chars);
  const number = chars.reduce((acc, curr, index) => {
    let currentValue = roman_numerals.find(
      (element) => element.Symbol === curr,
    ).Value;

    let nextChar = chars[index + 1];

    let nextValue = nextChar
      ? roman_numerals.find((element) => element.Symbol === chars[index + 1])
          .Value
      : 0;

    if (nextValue > currentValue) {
      return acc - currentValue;
    } else {
      return acc + currentValue;
    }
  }, 0);
  return number;
};

console.log(romanToInt("III"));

console.log(romanToInt("MCMXCIV"));
