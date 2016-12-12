"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @author alteredq / http://alteredqualia.com/
 */

exports.default = function () {
  function ClearMaskPass(scene, camera) {
    if (!(this instanceof ClearMaskPass)) return new ClearMaskPass(scene, camera);
    this.enabled = true;
  }

  ClearMaskPass.prototype = {
    render: function render(renderer, writeBuffer, readBuffer, delta) {
      var context = renderer.context;
      context.disable(context.STENCIL_TEST);
    }
  };

  return ClearMaskPass;
};