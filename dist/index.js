'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClearMaskPass = exports.MaskPass = exports.ShaderPass = exports.RenderPass = exports.CopyShader = undefined;

var _threeCopyshader = require('three-copyshader');

Object.defineProperty(exports, 'CopyShader', {
  enumerable: true,
  get: function get() {
    return _threeCopyshader.CopyShader;
  }
});

var _renderpass = require('./lib/renderpass');

Object.defineProperty(exports, 'RenderPass', {
  enumerable: true,
  get: function get() {
    return _renderpass.RenderPass;
  }
});

var _shaderpass = require('./lib/shaderpass');

Object.defineProperty(exports, 'ShaderPass', {
  enumerable: true,
  get: function get() {
    return _shaderpass.ShaderPass;
  }
});

var _maskpass = require('./lib/maskpass');

Object.defineProperty(exports, 'MaskPass', {
  enumerable: true,
  get: function get() {
    return _maskpass.MaskPass;
  }
});

var _clearmaskpass = require('./lib/clearmaskpass');

Object.defineProperty(exports, 'ClearMaskPass', {
  enumerable: true,
  get: function get() {
    return _clearmaskpass.ClearMaskPass;
  }
});

var _three = require('three');

exports.default = function () {
  function EffectComposer(renderer, renderTarget) {
    this.renderer = renderer;

    if (renderTarget === undefined) {
      var width = window.innerWidth || 1;
      var height = window.innerHeight || 1;
      var parameters = { minFilter: _three.LinearFilter, magFilter: _three.LinearFilter, format: _three.RGBFormat, stencilBuffer: false };

      renderTarget = new _three.WebGLRenderTarget(width, height, parameters);
    }

    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

    this.passes = [];

    this.copyPass = new _shaderpass.ShaderPass(_threeCopyshader.CopyShader);
  }

  EffectComposer.prototype = {
    swapBuffers: function swapBuffers() {
      var tmp = this.readBuffer;
      this.readBuffer = this.writeBuffer;
      this.writeBuffer = tmp;
    },

    addPass: function addPass(pass) {
      this.passes.push(pass);
    },

    insertPass: function insertPass(pass, index) {
      this.passes.splice(index, 0, pass);
    },

    render: function render(delta) {
      this.writeBuffer = this.renderTarget1;
      this.readBuffer = this.renderTarget2;

      var maskActive = false;

      var _passes$length = this.passes.length,
          pass = _passes$length.pass,
          i = _passes$length.i,
          il = _passes$length.il;


      for (i = 0; i < il; i++) {
        pass = this.passes[i];

        if (!pass.enabled) continue;

        pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive);

        if (pass.needsSwap) {
          if (maskActive) {
            var context = this.renderer.context;

            context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);

            this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta);

            context.stencilFunc(context.EQUAL, 1, 0xffffffff);
          }

          this.swapBuffers();
        }

        if (pass instanceof _maskpass.MaskPass) {
          maskActive = true;
        } else if (pass instanceof _clearmaskpass.ClearMaskPass) {
          maskActive = false;
        }
      }
    },

    reset: function reset(renderTarget) {
      if (renderTarget === undefined) {
        renderTarget = this.renderTarget1.clone();

        renderTarget.width = window.innerWidth;
        renderTarget.height = window.innerHeight;
      }

      this.renderTarget1 = renderTarget;
      this.renderTarget2 = renderTarget.clone();

      this.writeBuffer = this.renderTarget1;
      this.readBuffer = this.renderTarget2;
    },

    setSize: function setSize(width, height) {
      var renderTarget = this.renderTarget1.clone();

      renderTarget.width = width;
      renderTarget.height = height;

      this.reset(renderTarget);
    }

  };

  // shared ortho camera

  EffectComposer.camera = new _three.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  EffectComposer.quad = new _three.Mesh(new _three.PlaneGeometry(2, 2), null);

  EffectComposer.scene = new _three.Scene();
  EffectComposer.scene.add(EffectComposer.quad);

  return EffectComposer;
};