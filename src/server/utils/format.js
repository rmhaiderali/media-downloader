String.prototype.format = function () {
  return this.replace(/{(\d+)}/g, (match, number) => {
    return typeof arguments[number] !== "undefined" ? arguments[number] : match
  })
}
