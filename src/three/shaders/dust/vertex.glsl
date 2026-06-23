attribute float aSeed;   // per-particle random 0..1

varying float vAlpha;
varying float vSeed;

uniform float uTime;

// Simple cheap noise for organic drift.
float n(float x) {
  return sin(x) * 0.5 + sin(x * 2.3) * 0.3 + sin(x * 4.7) * 0.2;
}

void main() {
  // Drift slowly through the room volume with a gentle figure-8 / sine wander.
  float t = uTime * 0.08;
  vec3 pos = position;

  pos.x += n(t + aSeed * 31.0) * 0.6;
  pos.y += sin(t * 0.8 + aSeed * 12.0) * 0.4;
  pos.z += n(t * 1.2 + aSeed * 7.0) * 0.6;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  gl_PointSize = (3.0 + aSeed * 4.0) * (250.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

  // Slow breathing alpha so motes twinkle rather than stare.
  vAlpha = 0.15 + 0.15 * sin(uTime * 0.5 + aSeed * 20.0);
  vSeed = aSeed;
}
