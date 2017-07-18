precision highp float;

uniform float u_map_dimensions;
uniform sampler2D u_texmap;
uniform vec2 u_light_position[16];
uniform float u_light_intensity[16];
uniform bool u_light_enabled[16];
uniform float u_ambient_light;

varying vec2 v_texcoord;
varying vec2 v_world_pos;
varying vec4 v_color;

void main() {
  float brightness = u_ambient_light;

  for (int i = 0; i < 32; i++) {
    if (u_light_enabled[i]) {
      float dist = distance(v_world_pos, u_light_position[i]);
      float attenuation = 1.0 / (1.0 + (0.05 * dist) + (0.005 * dist * dist));
      brightness += u_light_intensity[i] * attenuation;
    }
  }

  // brightness = clamp(brightness, 0.0, 1.0);

  vec4 sampledColor = texture2D(u_texmap, vec2(v_texcoord.s / u_map_dimensions, v_texcoord.t / u_map_dimensions));
  gl_FragColor = vec4(sampledColor.rgb * brightness, sampledColor.a * v_color.a);
}
