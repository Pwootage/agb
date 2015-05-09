/*
 * Copyright (C) 2015 Pwootage <pwootage at gmail dot com>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

Module['_main'] = function () {
  //Set up native calls
  var gb_init = Module.cwrap('gb_init', 'number', []);
  var gb_load = Module.cwrap('gb_load', 'number', ['string']);
  var gb_run_frame = Module.cwrap('gb_run_frame', 'number', []);
  var gb_video_buffer = Module.cwrap('gb_video_buffer', 'number', []);
  var gb_audio_buffer = Module.cwrap('gb_audio_buffer', 'number', []);

  //Init gambatte
  var init = gb_init();
  console.log('gb_init: ' + init);

  var vbuff = gb_video_buffer();
  var abuff = gb_audio_buffer();

  console.log('Video buffer ptr: ' + vbuff);
  console.log('Audio buffer ptr: ' + abuff);

  var loaded = gb_load('/test.gb');
  console.log('gb_load: ' + loaded);

  //Init video output
  var vbCanvas = document.createElement("canvas");
  vbCanvas.width = 160;
  vbCanvas.height = 144;
  var vbCtx = vbCanvas.getContext("2d");

  var canvas = document.getElementById("videoout");
  var ctx = canvas.getContext("2d");

  var gameImg = ctx.createImageData(160, 144);

  //setup fps meter
  var fps = new FPSMeter(document.body, {
    top: '5px',
    bottom: 'auto',
    left: 'auto',
    right: '5px'
  });

  //Functions
  function draw() {
    //Set alpha (maybe fix this in libgambatte? Will be some tracking down, but would probably be faster)
    for (var i = 0; i < 160 * 144; i++) {
      Module.HEAP32[(vbuff >> 2) + i] |= 0xFF000000;
    }
    //Copy video buffer right out of memory!
    gameImg.data.set(Module.HEAPU8.subarray(vbuff, vbuff + 160 * 144 * 4));

    vbCtx.putImageData(gameImg, 0, 0);
    ctx.drawImage(vbCanvas, 0, 0, 160, 144, 0, 0, 160*2, 144*2);
    fps.tick();
  }

  function runFrame() {
    var frame = gb_run_frame();
    draw();
    requestAnimationFrame(runFrame);
  }

  runFrame();

  window.testgb = function () {
    var start = new Date();
    var frames = 10000;
    console.log('running ' + frames + ' frames...');
    for (var i = 0; i < frames; i++) gb_run_frame();
    var end = new Date();
    var ms = end - start;
    var fps = (frames / ms) * 1000;
    console.log('fps: ', fps);
  }

}
