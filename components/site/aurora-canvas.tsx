"use client"

import { useEffect, useRef } from "react"

const VERTEX_SOURCE = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const FRAGMENT_SOURCE = `
precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotation = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = rotation * p * 2.03 + 11.7;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / max(uResolution.y, 1.0);
  vec2 p = uv * 1.25;
  float t = uTime * 0.032;

  vec2 warp = vec2(
    fbm(p * 1.55 + vec2(0.0, t)),
    fbm(p * 1.55 + vec2(4.3, -t))
  );
  float f = fbm(p * 1.9 + warp * 1.35 + uPointer * 0.28);
  float band = smoothstep(0.22, 0.86, f);

  vec3 col = vec3(0.015, 0.014, 0.022);

  float violetField = length(uv - vec2(-0.58, 0.30));
  col += vec3(0.235, 0.170, 0.640) * band * smoothstep(1.45, 0.0, violetField) * 0.95;

  float aquaField = length(uv - vec2(0.66, -0.08));
  col += vec3(0.045, 0.400, 0.360) * smoothstep(0.36, 0.95, f) * smoothstep(1.30, 0.0, aquaField) * 0.72;

  float limeField = length((uv - vec2(0.10, -0.42)) * vec2(1.0, 1.55));
  col += vec3(0.520, 0.760, 0.190) * pow(band, 3.0) * smoothstep(1.05, 0.0, limeField) * 0.48;

  float vignette = smoothstep(1.75, 0.25, length(uv * vec2(0.82, 1.0)));
  col *= 0.55 + 0.45 * vignette;

  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * 0.02;

  gl_FragColor = vec4(col, 1.0);
}
`

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      premultipliedAlpha: false,
    })

    if (!gl) return

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SOURCE)
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SOURCE)
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return
    }

    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, "aPosition")
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    const resolutionLocation = gl.getUniformLocation(program, "uResolution")
    const timeLocation = gl.getUniformLocation(program, "uTime")
    const pointerLocation = gl.getUniformLocation(program, "uPointer")

    let width = 1
    let height = 1

    const resize = () => {
      const scale = Math.min(1, 900 / Math.max(window.innerWidth, 1)) * 0.62
      width = Math.max(1, Math.floor(window.innerWidth * scale))
      height = Math.max(1, Math.floor(window.innerHeight * scale))
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
      gl.uniform2f(resolutionLocation, width, height)
    }

    resize()

    const pointer = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }

    const onPointerMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 2
      target.y = (event.clientY / window.innerHeight - 0.5) * -2
    }

    let frame = 0
    let visible = true
    const start = performance.now()

    const render = (now: number) => {
      if (!visible) return
      pointer.x += (target.x - pointer.x) * 0.035
      pointer.y += (target.y - pointer.y) * 0.035
      gl.uniform1f(timeLocation, (now - start) / 1000)
      gl.uniform2f(pointerLocation, pointer.x, pointer.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      frame = window.requestAnimationFrame(render)
    }

    if (reducedMotion) {
      gl.uniform1f(timeLocation, 12)
      gl.uniform2f(pointerLocation, 0, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    } else {
      frame = window.requestAnimationFrame(render)
      window.addEventListener("pointermove", onPointerMove, { passive: true })
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame)
      } else if (!reducedMotion) {
        frame = window.requestAnimationFrame(render)
      }
    }

    const onResize = () => {
      resize()
      if (reducedMotion) gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("resize", onResize)

    return () => {
      visible = false
      window.cancelAnimationFrame(frame)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("pointermove", onPointerMove)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteBuffer(buffer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-70 [mix-blend-mode:screen]"
    />
  )
}
