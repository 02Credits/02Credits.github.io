precision mediump float;

uniform sampler2D u_texmap;

varying vec2 v_texcoord;

void main() {
  gl_FragColor = texture2D(u_texmap, v_texcoord);
}