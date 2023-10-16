String.prototype.conditionalConcat = function (boolean, value) {
  return boolean ? this + " " + value : this
}
