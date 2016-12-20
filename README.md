# three-effectcomposer-es6 #

ES6-friendly version of `THREE.EffectComposer`, which offers a quick
GLSL post-processing implementation.

Full credit goes to [@alteredq](http://github.com/alteredq) for writing this,
and to [@hughsk](http://github.com/hughsk) for the Browserify-friendly version. The original source can be found
[here](http://mrdoob.github.com/three.js/examples/webgl_postprocessing.html).

## Installation ##

``` bash
npm install three-effectcomposer-es6
```

## Usage ##

``` javascript
import { WebGLRenderer, Scene, PerspectiveCamera } from 'three'
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'

class Main {
  constructor () {
    const renderer = new WebGLRenderer()
    const scene = new Scene()
    const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)

    // When you've made your scene, create your composer and first RenderPass
    this.composer = new EffectComposer(renderer)
    this.composer.addPass(new RenderPass(scene, camera))

    // Add shaders! Celebrate!
    // const someShaderPass = new ShaderPass(SomeShader)
    // this.composer.addPass(someShaderPass)

    // And draw to the screen
    const copyPass = new ShaderPass(CopyShader)
    copyPass.renderToScreen = true
    this.composer.addPass(copyPass)
  }

  animate () {
    // Instead of calling renderer.render, use
    // composer.render instead:
    this.composer.render()
    window.requestAnimationFrame(this.animate)
  }
}

const main = new Main()
main.animate()
```
