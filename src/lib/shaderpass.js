/**
 * @author alteredq / http://alteredqualia.com/
 */

import EffectComposer from '../index'
import { UniformsUtils, ShaderMaterial } from 'three'

function ShaderPass (shader, textureID) {
  if (!(this instanceof ShaderPass)) return new ShaderPass(shader, textureID)

  this.textureID = (textureID !== undefined) ? textureID : 'tDiffuse'

  this.uniforms = UniformsUtils.clone(shader.uniforms)

  this.material = new ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader
  })

  this.renderToScreen = false

  this.enabled = true
  this.needsSwap = true
  this.clear = false
}

ShaderPass.prototype.render = function (renderer, writeBuffer, readBuffer, delta) {
  if (this.uniforms[ this.textureID ]) {
    this.uniforms[ this.textureID ].value = readBuffer.texture
  }

  EffectComposer.quad.material = this.material

  if (this.renderToScreen) {
    renderer.render(EffectComposer.scene, EffectComposer.camera)
  } else {
    renderer.render(EffectComposer.scene, EffectComposer.camera, writeBuffer, this.clear)
  }
}

export { ShaderPass }
