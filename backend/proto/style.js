String.prototype.style = function (style) {
  return "\x1b[" + style + "m" + this + "\x1b[0m"
}
