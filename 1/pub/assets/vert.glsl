uniform float u_map_dimensions;
uniform float u_display_dimensions;

attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

void main() {
  gl_Position = vec4((a_position), 0, 1);

  v_texcoord = vec2(a_texcoord.x / (u_map_dimensions / 1.5), a_texcoord.y / (u_map_dimensions / 1.5));
}
