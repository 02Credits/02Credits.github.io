precision highp float;

uniform float u_map_dimensions;
uniform sampler2D u_texmap;

varying vec2 v_texcoord;

void main() {
  gl_FragColor = texture2D(u_texmap, vec2(v_texcoord.s / u_map_dimensions, v_texcoord.t / u_map_dimensions));
}
