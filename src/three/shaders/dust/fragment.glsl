varying float vAlpha;
varying float vSeed;

uniform vec3 uColor;

void main() {
  // Circular, soft-edged dust mote.
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);

  if (dist > 0.5) {
    discard;
  }

  float soft = 1.0 - smoothstep(0.0, 0.5, dist);
  gl_FragColor = vec4(uColor, soft * vAlpha);
}
