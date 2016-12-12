'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _three = require('three');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @author alteredq / http://alteredqualia.com/
 */

exports.default = function () {
  function ShaderPass(shader, textureID) {
    if (!(this instanceof ShaderPass)) return new ShaderPass(shader, textureID);

    this.textureID = textureID !== undefined ? textureID : 'tDiffuse';

    this.uniforms = _three.UniformsUtils.clone(shader.uniforms);

    this.material = new _three.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader
    });

    this.renderToScreen = false;

    this.enabled = true;
    this.needsSwap = true;
    this.clear = false;
  }

  ShaderPass.prototype = {
    render: function render(renderer, writeBuffer, readBuffer, delta) {
      if (this.uniforms[this.textureID]) {
        this.uniforms[this.textureID].value = readBuffer;
      }

      _index2.default.quad.material = this.material;

      if (this.renderToScreen) {
        renderer.render(_index2.default.scene, _index2.default.camera);
      } else {
        renderer.render(_index2.default.scene, _index2.default.camera, writeBuffer, this.clear);
      }
    }

  };

  return ShaderPass;
};