precision highp float;

uniform float u_map_dimensions;
uniform sampler2D u_texmap;

varying vec2 v_texcoord;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  gl_FragColor = texture2D(u_texmap, vec2(v_texcoord.s / u_map_dimensions, v_texcoord.t / u_map_dimensions));
}
