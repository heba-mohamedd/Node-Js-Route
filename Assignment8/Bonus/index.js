var longestCommonPrefix = function (strs) {
  let prefix = "";
  for (let i = 0; i < strs[0].length; i++) {
    let flag = 0;
    for (const element of strs) {
      if (strs[0].charAt(i) !== element.charAt(i)) {
        flag = 1;
        break;
      }
    }
    if (flag == 0) prefix += strs[0].charAt(i);
    else break;
  }
  return prefix;
};

console.log(longestCommonPrefix(["flower", "flow", "flight"]));
console.log(longestCommonPrefix(["dog", "racecar", "car"]));
