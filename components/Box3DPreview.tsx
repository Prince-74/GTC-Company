"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { FaArrowsRotate, FaBoxOpen, FaEye } from "react-icons/fa6";
import styles from "./Box3DPreview.module.css";

interface Box3DPreviewProps {
  length: number; // in current unit
  width: number;
  height: number;
  unit?: string; // "inch" | "cm" | "mm"
  ply?: string;
  theme?: "dark" | "light";
}

export default function Box3DPreview({
  length = 14,
  width = 10,
  height = 8,
  unit = "inch",
  ply = "5-Ply",
  theme = "dark"
}: Box3DPreviewProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isOpenFlaps, setIsOpenFlaps] = useState(false);

  // Normalize dimensions to a reasonable 3D scale
  const normalizedDim = useMemo(() => {
    const l = Math.max(1, Number(length) || 12);
    const w = Math.max(1, Number(width) || 10);
    const h = Math.max(1, Number(height) || 8);
    const maxVal = Math.max(l, w, h);
    const scale = 3.8 / maxVal;
    return {
      x: l * scale,
      z: w * scale,
      y: h * scale,
      rawL: l,
      rawW: w,
      rawH: h
    };
  }, [length, width, height]);

  // Calculate volume & capacity
  const metrics = useMemo(() => {
    let volLiters = 0;
    let volCuIn = 0;
    const l = normalizedDim.rawL;
    const w = normalizedDim.rawW;
    const h = normalizedDim.rawH;

    if (unit === "inch") {
      volCuIn = l * w * h;
      volLiters = volCuIn * 0.0163871;
    } else if (unit === "cm") {
      const volCm3 = l * w * h;
      volLiters = volCm3 / 1000;
      volCuIn = volCm3 * 0.0610237;
    } else {
      // mm
      const volMm3 = l * w * h;
      volLiters = volMm3 / 1000000;
      volCuIn = volMm3 * 0.0000610237;
    }

    const estLoadKg =
      ply === "7-Ply"
        ? Math.round(volLiters * 1.5 + 25)
        : ply === "5-Ply"
        ? Math.round(volLiters * 1.1 + 15)
        : Math.round(volLiters * 0.7 + 8);

    return {
      volumeLiters: volLiters.toFixed(1),
      volumeCuIn: Math.round(volCuIn),
      estLoadKg: Math.min(120, Math.max(5, estLoadKg))
    };
  }, [normalizedDim, unit, ply]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let widthPx = host.clientWidth || 400;
    let heightPx = host.clientHeight || 340;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(widthPx, heightPx);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    host.innerHTML = "";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, widthPx / heightPx, 0.1, 100);
    camera.position.set(4.5, 3.8, 5.5);
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, theme === "dark" ? 1.4 : 1.7);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff3e3, theme === "dark" ? 2.4 : 2.8);
    mainLight.position.set(6, 9, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xecaa60, 1.2);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xa5c4d4, 0.6);
    fillLight.position.set(-4, -2, 4);
    scene.add(fillLight);

    // Box Root Group
    const boxGroup = new THREE.Group();
    scene.add(boxGroup);

    // Kraft texture simulation procedural
    const canvasTexture = document.createElement("canvas");
    canvasTexture.width = 256;
    canvasTexture.height = 256;
    const ctx = canvasTexture.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#c08552";
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      for (let i = 0; i < 3000; i++) {
        const px = Math.random() * 256;
        const py = Math.random() * 256;
        ctx.fillRect(px, py, 1, 1);
      }
      // Corrugation subtle horizontal grain
      ctx.fillStyle = "rgba(0,0,0,0.03)";
      for (let y = 0; y < 256; y += 4) {
        ctx.fillRect(0, y, 256, 1);
      }
    }
    const kraftTexture = new THREE.CanvasTexture(canvasTexture);
    kraftTexture.wrapS = THREE.RepeatWrapping;
    kraftTexture.wrapT = THREE.RepeatWrapping;

    const boxMaterial = new THREE.MeshStandardMaterial({
      color: theme === "dark" ? 0xb57845 : 0xc78a54,
      map: kraftTexture,
      roughness: 0.82,
      metalness: 0.05
    });

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: theme === "dark" ? 0x221a14 : 0x7c4e27,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.7
    });

    // Box Body
    const bx = normalizedDim.x;
    const by = normalizedDim.y;
    const bz = normalizedDim.z;

    const bodyGeom = new THREE.BoxGeometry(bx, by, bz);
    const bodyMesh = new THREE.Mesh(bodyGeom, boxMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    boxGroup.add(bodyMesh);

    // Crease edge lines
    const edgeGeom = new THREE.EdgesGeometry(bodyGeom);
    const edgeLines = new THREE.LineSegments(edgeGeom, edgeMaterial);
    bodyMesh.add(edgeLines);

    // Box Tape on Top/Bottom
    const tapeMat = new THREE.MeshStandardMaterial({
      color: 0x8a5d35,
      roughness: 0.6,
      transparent: true,
      opacity: 0.85
    });
    const topTapeGeom = new THREE.PlaneGeometry(bx * 0.96, bz * 0.22);
    const topTape = new THREE.Mesh(topTapeGeom, tapeMat);
    topTape.rotation.x = -Math.PI / 2;
    topTape.position.y = by / 2 + 0.002;
    boxGroup.add(topTape);

    // GTC Stamp / Print on Box Face
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 256;
    labelCanvas.height = 128;
    const lCtx = labelCanvas.getContext("2d");
    if (lCtx) {
      lCtx.clearRect(0, 0, 256, 128);
      lCtx.fillStyle = "#1e140d";
      lCtx.font = "bold 26px sans-serif";
      lCtx.fillText("GTC PACKAGING", 20, 45);
      lCtx.font = "14px sans-serif";
      lCtx.fillText(ply.toUpperCase() + " QUALITY", 20, 70);
      lCtx.fillText("DIRECT MANUFACTURER", 20, 92);
      // Up arrows icon
      lCtx.lineWidth = 3;
      lCtx.strokeStyle = "#1e140d";
      lCtx.strokeRect(200, 20, 36, 75);
      lCtx.beginPath();
      lCtx.moveTo(218, 30);
      lCtx.lineTo(218, 85);
      lCtx.moveTo(210, 42);
      lCtx.lineTo(218, 30);
      lCtx.lineTo(226, 42);
      lCtx.stroke();
    }
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    const labelMat = new THREE.MeshBasicMaterial({
      map: labelTex,
      transparent: true,
      opacity: 0.82
    });
    const labelPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(Math.min(bx * 0.7, 1.8), Math.min(by * 0.45, 0.9)),
      labelMat
    );
    labelPlane.position.set(0, 0, bz / 2 + 0.003);
    boxGroup.add(labelPlane);

    // Shadow catcher floor
    const floorGeom = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.ShadowMaterial({ opacity: theme === "dark" ? 0.45 : 0.2 });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -by / 2 - 0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Mouse Interaction
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotSpeed = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMousePos = { x: clientX, y: clientY };
    };

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMousePos.x;
      const deltaY = clientY - prevMousePos.y;

      boxGroup.rotation.y += deltaX * 0.008;
      boxGroup.rotation.x += deltaY * 0.008;

      rotSpeed = { x: deltaY * 0.002, y: deltaX * 0.002 };
      prevMousePos = { x: clientX, y: clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const hostElem = host;
    hostElem.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    hostElem.addEventListener("touchstart", onMouseDown, { passive: true });
    window.addEventListener("touchmove", onMouseMove, { passive: true });
    window.addEventListener("touchend", onMouseUp);

    const onResize = () => {
      if (!host) return;
      widthPx = host.clientWidth;
      heightPx = host.clientHeight;
      camera.aspect = widthPx / heightPx;
      camera.updateProjectionMatrix();
      renderer.setSize(widthPx, heightPx);
    };

    window.addEventListener("resize", onResize);

    // Animation Loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        if (isRotating) {
          boxGroup.rotation.y += 0.006;
        } else {
          boxGroup.rotation.y += rotSpeed.y;
          boxGroup.rotation.x += rotSpeed.x;
          rotSpeed.x *= 0.94;
          rotSpeed.y *= 0.94;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      hostElem.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      hostElem.removeEventListener("touchstart", onMouseDown);
      window.removeEventListener("touchmove", onMouseMove);
      window.removeEventListener("touchend", onMouseUp);

      bodyGeom.dispose();
      edgeGeom.dispose();
      boxMaterial.dispose();
      edgeMaterial.dispose();
      kraftTexture.dispose();
      labelTex.dispose();
      floorGeom.dispose();
      floorMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.remove();
      }
    };
  }, [normalizedDim, ply, theme, isRotating, isOpenFlaps]);

  return (
    <div className={styles.container}>
      <div className={styles.overlayTop}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>Interactive 3D Preview</span>
        </div>

        <div className={styles.controlsGroup}>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => setIsRotating((prev) => !prev)}
            title="Toggle Auto Rotation"
          >
            <FaArrowsRotate aria-hidden="true" />
            <span>{isRotating ? "Pause" : "Rotate"}</span>
          </button>
        </div>
      </div>

      <div className={styles.canvasHost} ref={hostRef} />

      <div className={styles.overlayBottom}>
        <div className={styles.specsCard}>
          <div className={styles.specItem}>
            <span>Dimensions</span>
            <strong>
              {length} × {width} × {height} {unit}
            </strong>
          </div>
          <div className={styles.specItem}>
            <span>Volume</span>
            <strong>
              {metrics.volumeLiters} L ({metrics.volumeCuIn} in³)
            </strong>
          </div>
          <div className={styles.specItem}>
            <span>Est. Load Rating</span>
            <strong>~{metrics.estLoadKg} kg</strong>
          </div>
        </div>

        <span className={styles.hint}>Drag to rotate 360°</span>
      </div>
    </div>
  );
}
