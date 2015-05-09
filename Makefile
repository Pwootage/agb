CXXFLAGS=-I./include -Wall -Wextra -O2 -fomit-frame-pointer -Wno-warn-absolute-paths -fno-exceptions -fno-rtti -DHAVE_STDINT_H
EXPORTED_FUNCTIONS=['_gb_init', '_gb_load', '_gb_run_frame', '_gb_video_buffer', '_gb_audio_buffer']

BCFILES=$(patsubst %.cpp,%.bc,$(wildcard src/native/*.cpp))

default: src/web/gambatte.min.js

%.bc: %.cpp
	${CXX} ${CXXFLAGS} -o $@ $< -L./lib -lgambatte

src/web/gambatte.min.js: ${BCFILES}
	${CXX} ${CXXFLAGS} -v -o $@ $< -s EXPORTED_FUNCTIONS="${EXPORTED_FUNCTIONS}"

.phony: clean

clean:
	rm -f src/native/*.bc
	rm -f src/web/gambatte.min.js src/web/gambatte.min.js.mem
