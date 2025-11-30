"use client"

import { useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Float, ContactShadows, Grid, Sparkles } from "@react-three/drei"

function MechEye({ primary = "#00FF99", accent = "#00E5FF" }) {
  const group = useRef()
  const orbit = useRef()

  useFrame(({ mouse, clock }) => {
    if (!group.current) return
    // look toward cursor (smooth)
    const targetY = mouse.x * 0.6
    const targetX = -mouse.y * 0.4
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.06
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.06

    // subtle alive pulse
    const t = clock.getElapsedTime()
    const s = 1 + Math.sin(t * 1.2) * 0.015
    group.current.scale.set(s, s, s)

    // orbiting plates
    if (orbit.current) {
      orbit.current.rotation.y = t * 0.4
    }
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.45}>
        {/* Outer shell - dark metal + wireframe overlay */}
        <mesh>
          <sphereGeometry args={[1.35, 64, 64]} />
          <meshStandardMaterial color={"#0a0f0d"} metalness={0.7} roughness={0.22} transparent opacity={0.85} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.36, 64, 64]} />
          <meshBasicMaterial color={accent} wireframe opacity={0.85} transparent />
        </mesh>

        {/* Glowing iris ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.75, 0.08, 32, 128]} />
          <meshStandardMaterial
            color={primary}
            emissive={primary}
            emissiveIntensity={0.6}
            metalness={0.4}
            roughness={0.1}
          />
        </mesh>

        {/* Pupil core */}
        <mesh>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.8}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>

        {/* Orbiting plates for robotic feel */}
        <group ref={orbit}>
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2
            const r = 1.6
            return (
              <mesh key={i} position={[Math.cos(a) * r, 0.0, Math.sin(a) * r]} rotation={[0, a, 0]}>
                <boxGeometry args={[0.18, 0.06, 0.42]} />
                <meshStandardMaterial
                  color={"#0f2b24"}
                  metalness={0.6}
                  roughness={0.25}
                  emissive={i % 2 === 0 ? primary : accent}
                  emissiveIntensity={0.15}
                />
              </mesh>
            )
          })}
        </group>
      </Float>
    </group>
  )
}

function ParallaxCamera() {
  const { camera } = useThree()
  useFrame(({ mouse }) => {
    const targetX = mouse.x * 0.2
    const targetY = mouse.y * -0.15
    camera.position.x += (targetX - camera.position.x) * 0.05
    camera.position.y += (targetY - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Hero3D() {
  return (
    <div className="hero3d-canvas" aria-hidden="true">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5.2], fov: 55 }} gl={{ powerPreference: "high-performance" }}>
        {/* lighting and environment */}
        <ambientLight intensity={0.55} />
        <pointLight position={[4, 6, 6]} intensity={1.4} color={"#aaffee"} />
        <pointLight position={[-4, -2, 2]} intensity={0.9} color={"#00ff99"} />
        <Environment preset="night" />

        {/* parallax camera for subtle depth */}
        <ParallaxCamera />

        {/* hacker grid and sparkles */}
        <Grid
          position={[0, -1.75, 0]}
          args={[10, 10]}
          cellSize={0.6}
          cellThickness={0.6}
          sectionSize={3.6}
          sectionThickness={0.9}
          fadeDistance={20}
          fadeStrength={2.5}
          infiniteGrid
          cellColor="#073a2e"
          sectionColor="#0f5a46"
        />
        <Sparkles scale={[8, 6, 4]} count={50} speed={0.35} size={2} opacity={0.25} color="#00ff99" />

        {/* robotic centerpiece */}
        <MechEye primary="#00FF99" accent="#00E5FF" />

        {/* soft shadows */}
        <ContactShadows position={[0, -1.6, 0]} opacity={0.3} scale={12} blur={2.2} />
      </Canvas>
      {/* Subtle vignette for premium look */}
      <div className="hero3d-vignette" />
    </div>
  )
}
