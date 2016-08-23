precision mediump float;
uniform vec2 canvasSize;
uniform vec3 cameraPos;

vec3 lightPosition = vec3(-5, 5, 0);
vec4 lightColor = vec4(0.1, 0.1, 0.1, 1);

// polynomial smooth min (k = 0.1);
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float floorMap(vec3 p)
{
  return p.y;
}

float boxMap(vec3 p)
{
  vec3 q = p + vec3(1, 2, 2);
  //q = mod(q, vec3(2)) - 0.5 * vec3(2);

  float c = cos(2.0 * q.y);
  float s = sin(2.0 * q.y);
  mat2 m = mat2(c, -s, s, c);
  vec3 r = vec3(m*q.xz, q.y);

  return length(q) - 0.5;
}

float map(vec3 p)
{
  return min(floorMap(p), boxMap(p));
}

vec3 getNormal(vec3 p)
{
  float e = 0.01;
  vec3 ex = vec3(e, 0, 0);
  vec3 ey = vec3(0, e, 0);
  vec3 ez = vec3(0, 0, e);
  return normalize(vec3(map(p + ex) - map(p - ex), map(p + ey) - map(p - ey), map(p + ez) - map(p - ez)));
}

vec4 applyFog(vec4 color, float dist)
{
  float fogAmount = clamp(1.0 - exp(-dist * 0.2), 0.00001, 1.0);
  vec4 fogColor = vec4(vec3(0), 1.0);
  return mix(color, fogColor, fogAmount);
}

float trace(vec3 o, vec3 r)
{
  float t = 0.0;
  for (int i = 0; i < 500; i++) {
    vec3 p = o + r * t;
    float d = map(p);
    if (d < 0.01) {
      return t;
    }
    t += d * 0.5;
  }
  return t;
}

void main ()
{
  vec2 uv = gl_FragCoord.xy / canvasSize.xy;
  uv = uv * 2.0 - 1.0;
  uv.y = uv.y * (canvasSize.y / canvasSize.x);
  vec3 r = normalize(vec3(uv, 1.0));
  vec3 o = cameraPos;

  float dist = trace(o, r);
  vec4 color = vec4(vec3(0.0), 1.0);

  if (dist < 1000.0) {
    vec3 collisionPoint = o + dist * r;
    vec3 normal = getNormal(collisionPoint);
    vec3 lightDisp = lightPosition - collisionPoint;
    float lightDist = length(lightDisp);
    float lightPathDist = trace(lightPosition, normalize(lightDisp));
    vec4 lightColor = lightColor * (1.0 - dot(normalize(lightDisp), normal)); // * (1.0 - (1.0 / (0.1 * lightDist)));
    if (lightDist - lightPathDist > 0.0) {
       lightColor = vec4(lightColor.xyz * 0.0, 1.0);
    }
    color = lightColor;
  }

  gl_FragColor = color;
}
