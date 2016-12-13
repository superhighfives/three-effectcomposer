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

## Running the Demo ##

Install the dependencies and build the script:

``` bash
git clone git@github.com:hughsk/three-effectcomposer.git
cd three-effectcomposer
npm install -d
npm run demo
```

Then just open up `index.html` to see the results.

## Usage ##

This module doesn't touch the `THREE` object, instead you access the different
pass classes through `EffectComposer`. For a working example, see
[`demo.js`](https://github.com/hughsk/three-effectcomposer/blob/master/demo.js).

``` javascript
import { WebGLRenderer, Scene, PerspectiveCamera } from 'three'
import EffectComposer, { RenderPass, ShaderPass } from 'three-effectcomposer-es6'

init()
animate()

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

  // Redraw with a shader
  const effect = new ShaderPass(DotScreenShader)
  composer.addPass(effect)

  // And another shader, drawing to the screen at this point
  var effect = new ShaderPass(RGBShiftShader)
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
