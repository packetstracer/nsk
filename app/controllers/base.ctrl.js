const BaseController = function (name) {
  this.name = name || 'base'
}


BaseController.prototype.getName = function () {
  return this.name
}


BaseController.prototype.setName = function (name) {
  this.name = name
}


BaseController.prototype.run = function (req, res, next) {
  console.info('Base controller: define a run method for child controller')
}


BaseController.prototype.extend = function (properties) {
  const Child = BaseController

  for (let prop in properties) {
    Child.prototype[prop] = properties[prop]
  }

  return Child
}


module.exports = new BaseController()
