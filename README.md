# three-effectcomposer-es6 #

ES6-friendly version of `THREE.EffectComposer`, which offers a quick
GLSL post-processing implementation.

Full credit goes to [@alteredq](http://github.com/alteredq) for writing this,
and to [@hughsk](http://github.com/hughsk) for the Browserify-friendly version. The original source can be found
[here](http://mrdoob.github.com/three.js/examples/webgl_postprocessing.html).

## Installation ##

TODO: Add to npm

``` bash
npm install three-effectcomposer-es6
```

## Usage ##

``` javascript
import { WebGLRenderer, Scene, PerspectiveCamera } from 'three'
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'

init()
animate()

let composer;

function init() {
  const renderer = new WebGLRenderer()
  const scene = new Scene()
  const camera = new PerspectiveCamera(70, window.innerWidth/window.innerHeight, 1, 1000)

  // ...
  // The rest of your setup code, as per usual
  // ...

  // Create your composer and first RenderPass
  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))

  // Add shaders! Celebrate

  // And draw to the screen
  var effect = new ShaderPass(CopyShader)
  effect.renderToScreen = true
  composer.addPass(effect)
};

// Instead of calling renderer.render, use
// composer.render instead:
function animate() {
  requestAnimationFrame(animate)
  composer.render()
};
```
