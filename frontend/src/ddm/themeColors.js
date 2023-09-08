String.prototype.format = function () {
  return this.replace(/{(\d+)}/g, (match, number) => {
    return typeof arguments[number] !== "undefined" ? arguments[number] : match;
  });
};

const parseColor = (string) => {
  const rgbRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
  const rgbaRegex = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([01]?(\.\d+)?)\)$/;

  const rgbMatch = string.match(rgbRegex);
  const rgbaMatch = string.match(rgbaRegex);

  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1]),
      g: parseInt(rgbaMatch[2]),
      b: parseInt(rgbaMatch[3]),
      a: parseFloat(rgbaMatch[4]),
    };
  } else if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  } else return this;
};

const colorMixCSS = (finalColorRGB, t) => {
  return CSS.supports("color", "color-mix(in srgb, AccentColor, transparent)")
    ? "color-mix(in srgb, var(--theme), transparent " + t + "%)"
    : "rgba({0}, 0.{1})".format(finalColorRGB, 100 - t);
};

const colorKeywordToRGB = (colorKeyword) => {
  const el = document.createElement("div");
  el.style.color = colorKeyword;
  document.body.appendChild(el);
  const value = window.getComputedStyle(el).color;
  document.body.removeChild(el);
  return value;
};

const AccentColor = parseColor(colorKeywordToRGB("AccentColor"));

const isAccentColorProvided = Boolean(
  AccentColor.r || AccentColor.g || AccentColor.b
);

const finalColorRGB = isAccentColorProvided
  ? "{0}, {1}, {2}".format(AccentColor.r, AccentColor.g, AccentColor.b)
  : "220, 53, 69";

document.body.style.setProperty(
  "--theme",
  isAccentColorProvided ? "AccentColor" : "#dc3545"
);

document.body.style.setProperty("--theme-t50", colorMixCSS(finalColorRGB, 50));

document.body.style.setProperty("--theme-t80", colorMixCSS(finalColorRGB, 80));
