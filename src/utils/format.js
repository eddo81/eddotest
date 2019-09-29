function capcase(string) {
  return string
    .replace(/\W+/g, "_")
    .split("_")
    .map(item => item[0].toUpperCase() + item.slice(1))
    .join("_");
}

function underscore(string) {
  return string
    .toLowerCase()
    .split(" ")
    .join("_");
}

function dash(string) {
  return string
    .toLowerCase()
    .split(" ")
    .join("-");
}

function prefix(string) {
  let prefix = "";
  const themeNameWords = string.split(" ");

  if (themeNameWords && themeNameWords.length >= 2) {
    for (const word of themeNameWords) {
      prefix += word.charAt(0).toUpperCase();
    }
  }

  // 2. If theme has only 1 word, use the first 3 letters of theme name
  if (prefix.length < 2 && string.length > 2) {
    prefix = `${string.charAt(0)}${string.charAt(1)}${string.charAt(
      2
    )}`.toUpperCase();
  }

  return prefix;
}

module.exports = {
  capcase,
  underscore,
  dash,
  prefix
};
