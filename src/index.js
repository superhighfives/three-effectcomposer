/**
 * @author alteredq / http://alteredqualia.com/
 */

import { LinearFilter, RGBFormat, WebGLRenderTarget, OrthographicCamera, Mesh, Scene, PlaneGeometry } from 'three'
import CopyShader from 'three-copyshader'
import ShaderPass from './lib/shaderpass'
import MaskPass from './lib/maskpass'
import ClearMaskPass from './lib/clearmaskpass'

export { CopyShader } from 'three-copyshader'
export { RenderPass } from './lib/renderpass'
export { ShaderPass } from './lib/shaderpass'
export { MaskPass } from './lib/maskpass'
export { ClearMaskPass } from './lib/clearmaskpass'

function EffectComposer (renderer, renderTarget) {
  this.renderer = renderer

  if (renderTarget === undefined) {
    var width = window.innerWidth || 1
    var height = window.innerHeight || 1
    var parameters = { minFilter: LinearFilter, magFilter: LinearFilter, format: RGBFormat, stencilBuffer: false }

    renderTarget = new WebGLRenderTarget(width, height, parameters)
  }

  this.renderTarget1 = renderTarget
  this.renderTarget2 = renderTarget.clone()

  this.writeBuffer = this.renderTarget1
  this.readBuffer = this.renderTarget2

  this.passes = []

  this.copyPass = new ShaderPass(CopyShader)
}

EffectComposer.prototype.swapBuffers = function () {
    var tmp = this.readBuffer
    this.readBuffer = this.writeBuffer
    this.writeBuffer = tmp
  }

EffectComposer.prototype.addPass = function (pass) {
    this.passes.push(pass)
  }

EffectComposer.prototype.insertPass = function (pass, index) {
    this.passes.splice(index, 0, pass)
  }

EffectComposer.prototype.render = function (delta) {
    this.writeBuffer = this.renderTarget1
    this.readBuffer = this.renderTarget2

    var maskActive = false

    var { pass, i, il } = this.passes.length

    for (i = 0; i < il; i++) {
      pass = this.passes[ i ]

      if (!pass.enabled) continue

      pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive)

      if (pass.needsSwap) {
        if (maskActive) {
          var context = this.renderer.context

          context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff)

          this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta)

          context.stencilFunc(context.EQUAL, 1, 0xffffffff)
        }

        this.swapBuffers()
      }

      if (pass instanceof MaskPass) {
        maskActive = true
      } else if (pass instanceof ClearMaskPass) {
        maskActive = false
      }
    }
  }

EffectComposer.prototype.reset = function (renderTarget) {
    if (renderTarget === undefined) {
      renderTarget = this.renderTarget1.clone()

      renderTarget.width = window.innerWidth
      renderTarget.height = window.innerHeight
    }

    this.renderTarget1 = renderTarget
    this.renderTarget2 = renderTarget.clone()

    this.writeBuffer = this.renderTarget1
    this.readBuffer = this.renderTarget2
  }

EffectComposer.prototype.setSize =  function (width, height) {
    var renderTarget = this.renderTarget1.clone()

    renderTarget.width = width
    renderTarget.height = height

    this.reset(renderTarget)
  }

// shared ortho camera

EffectComposer.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

EffectComposer.quad = new Mesh(new PlaneGeometry(2, 2), null)

EffectComposer.scene = new Scene()
EffectComposer.scene.add(EffectComposer.quad)

export default EffectComposer
