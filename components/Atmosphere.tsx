"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./Atmosphere.module.css";

interface AtmosphereProps {
  theme?: "dark" | "light";
}

export default function Atmosphere({ theme = "dark" }: AtmosphereProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.innerHTML = "";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.z = 8;

    const count = theme === "dark" ? 380 : 180;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorA = new THREE.Color(theme === "dark" ? "#f47a22" : "#d97706");
    const colorB = new THREE.Color(theme === "dark" ? "#9ca3af" : "#cbd5e1");

    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 16;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 10;
      const mixed = colorA.clone().lerp(colorB, Math.random() * 0.75);
      colors[index * 3] = mixed.r;
      colors[index * 3 + 1] = mixed.g;
      colors[index * 3 + 2] = mixed.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: theme === "dark" ? 0.035 : 0.025,
      transparent: true,
      opacity: theme === "dark" ? 0.55 : 0.28,
      vertexColors: true,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let raf = 0;
    const pointer = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.35;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.25;
    };

    const onResize = () => {
      if (!host) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };

    const animate = () => {
      particles.rotation.y += 0.0006;
      particles.rotation.x += 0.0002;
      camera.position.x += (pointer.x - camera.position.x) * 0.02;
      camera.position.y += (-pointer.y - camera.position.y) * 0.02;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.remove();
      }
    };
  }, [theme]);

  return <div className={styles.atmosphere} ref={hostRef} aria-hidden="true" />;
}
