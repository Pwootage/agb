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

/*
 * This file contains API used to more cleanly glue javascript to libgambatte
 */

#include "gambatte.h"
#include "gbint.h"
#include <stdio.h>
#include <string>


// #DEFINE LOG(char* msg)

using namespace std;

#define SAMPLES_PER_FRAME 35112
#define SAMPLES_MAX_EXTRA 2064

gambatte::GB* gb;
gambatte::uint_least32_t* videoBuffer;
gambatte::uint_least32_t* audioBuffer;
size_t samples;


extern "C" {
  int gb_init() {
    gb = new gambatte::GB();
    videoBuffer = new gambatte::uint_least32_t[160*144];
    audioBuffer = new gambatte::uint_least32_t[(SAMPLES_PER_FRAME + SAMPLES_MAX_EXTRA) * 2];
    return 0;
  }

  int gb_load(char* file) {
    return gb->load(string(file));
  }

  ptrdiff_t gb_run_frame() {
    samples = SAMPLES_PER_FRAME;
    ptrdiff_t off = gb->runFor(videoBuffer, (ptrdiff_t)160, audioBuffer, samples);
    return samples;
  }

  gambatte::uint_least32_t* gb_video_buffer() {
    return videoBuffer;
  }

  gambatte::uint_least32_t* gb_audio_buffer() {
    return audioBuffer;
  }
}
