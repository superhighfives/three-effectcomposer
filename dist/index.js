'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClearMaskPass = exports.MaskPass = exports.ShaderPass = exports.RenderPass = exports.CopyShader = undefined;

var _copyshader = require('./lib/copyshader');

Object.defineProperty(exports, 'CopyShader', {
  enumerable: true,
  get: function get() {
    return _copyshader.CopyShader;
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

  this.copyPass = new _shaderpass.ShaderPass(_copyshader.CopyShader);
}

EffectComposer.prototype.swapBuffers = function () {
  var tmp = this.readBuffer;
  this.readBuffer = this.writeBuffer;
  this.writeBuffer = tmp;
};

EffectComposer.prototype.addPass = function (pass) {
  this.passes.push(pass);
};

EffectComposer.prototype.insertPass = function (pass, index) {
  this.passes.splice(index, 0, pass);
};

EffectComposer.prototype.render = function (delta) {
  this.writeBuffer = this.renderTarget1;
  this.readBuffer = this.renderTarget2;

  var maskActive = false;

  for (var i = 0; i < this.passes.length; i++) {
    var pass = this.passes[i];

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
};

EffectComposer.prototype.reset = function (renderTarget) {
  if (renderTarget === undefined) {
    renderTarget = this.renderTarget1.clone();

    renderTarget.width = window.innerWidth;
    renderTarget.height = window.innerHeight;
  }

  this.renderTarget1 = renderTarget;
  this.renderTarget2 = renderTarget.clone();

  this.writeBuffer = this.renderTarget1;
  this.readBuffer = this.renderTarget2;
};

EffectComposer.prototype.setSize = function (width, height) {
  var renderTarget = this.renderTarget1.clone();

  renderTarget.width = width;
  renderTarget.height = height;

  this.reset(renderTarget);
};

// shared ortho camera

EffectComposer.camera = new _three.OrthographicCamera(-1, 1, 1, -1, 0, 1);

EffectComposer.quad = new _three.Mesh(new _three.PlaneGeometry(2, 2), null);

EffectComposer.scene = new _three.Scene();
EffectComposer.scene.add(EffectComposer.quad);

exports.default = EffectComposer;