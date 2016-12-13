/**
 * @author alteredq / http://alteredqualia.com/
 */

function ClearMaskPass (scene, camera) {
  if (!(this instanceof ClearMaskPass)) return new ClearMaskPass(scene, camera)
  this.enabled = true
}

ClearMaskPass.prototype.render = function (renderer, writeBuffer, readBuffer, delta) {
  var context = renderer.context
  context.disable(context.STENCIL_TEST)
}

export { ClearMaskPass }
