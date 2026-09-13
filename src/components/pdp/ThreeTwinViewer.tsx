"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Maximize2, Minimize2, Rotate3d, RotateCw, Ruler } from "lucide-react";
import * as THREE from "three";
import { SpatialRoom } from "@/types/property";

interface ThreeTwinViewerProps {
  rooms?: SpatialRoom[];
  propertyTitle: string;
}

const DEFAULT_ROOMS: SpatialRoom[] = [
  { id: "living", name: "Living & dining", dimensions: "22' x 16'", carpetSqft: 352, highlight: "Marble floor, glazed balcony doors", wallColor: "#F4F1EA", floorType: "Marble" },
  { id: "master", name: "Main bedroom", dimensions: "18' x 14'", carpetSqft: 252, highlight: "Engineered oak floor, private balcony", wallColor: "#EAE7DF", floorType: "Engineered oak" },
  { id: "kitchen", name: "Kitchen", dimensions: "14' x 11'", carpetSqft: 154, highlight: "Quartz counters, built-in appliances", wallColor: "#F8F8F8", floorType: "Vitrified tile" },
];

export const ThreeTwinViewer: React.FC<ThreeTwinViewerProps> = ({ rooms = DEFAULT_ROOMS, propertyTitle }) => {
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeRoom = rooms[activeRoomIndex] || rooms[0];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 400;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf1f5f9);

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 12, 22);
      camera.lookAt(0, 2, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;

      while (container.firstChild) container.removeChild(container.firstChild);
      container.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.85));
      const dirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
      dirLight.position.set(15, 25, 15);
      dirLight.castShadow = true;
      scene.add(dirLight);

      scene.add(new THREE.GridHelper(30, 30, 0x94a3b8, 0xe2e8f0));

      const roomGroup = new THREE.Group();

      const floorMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 12),
        new THREE.MeshStandardMaterial({ color: 0xe8e6df, roughness: 0.2, metalness: 0.1 }),
      );
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.receiveShadow = true;
      roomGroup.add(floorMesh);

      const wallMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeRoom.wallColor || "#F4F1EA"),
        roughness: 0.8,
        wireframe: wireframeMode,
      });
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(16, 6, 0.4), wallMat);
      backWall.position.set(0, 3, -6);
      roomGroup.add(backWall);
      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 12), wallMat);
      leftWall.position.set(-8, 3, 0);
      roomGroup.add(leftWall);

      const sofa = new THREE.Mesh(new THREE.BoxGeometry(7, 1.8, 3.5), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 }));
      sofa.position.set(0, 0.9, -2.5);
      roomGroup.add(sofa);
      const table = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.8, 2), new THREE.MeshStandardMaterial({ color: 0xc8a27a, roughness: 0.3 }));
      table.position.set(0, 0.4, 0.5);
      roomGroup.add(table);

      scene.add(roomGroup);

      let isDragging = false;
      let prevX = 0;
      const onDown = (e: PointerEvent) => {
        isDragging = true;
        prevX = e.clientX;
      };
      const onMove = (e: PointerEvent) => {
        if (!isDragging) return;
        roomGroup.rotation.y += (e.clientX - prevX) * 0.008;
        prevX = e.clientX;
      };
      const onUp = () => {
        isDragging = false;
      };
      const dom = renderer.domElement;
      dom.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);

      let animationId = 0;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        if (isRotating && !isDragging) roomGroup.rotation.y += 0.003;
        renderer.render(scene, camera);
      };
      animate();

      // Track container size (covers window resizes and the fullscreen toggle).
      const resizeObserver = new ResizeObserver(() => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      resizeObserver.observe(container);

      setWebGlSupported(true);

      return () => {
        cancelAnimationFrame(animationId);
        resizeObserver.disconnect();
        dom.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        renderer.dispose();
      };
    } catch {
      setWebGlSupported(false);
    }
  }, [activeRoomIndex, isRotating, wireframeMode, activeRoom.wallColor]);

  return (
    <section
      aria-labelledby="tour-heading"
      className={`panel overflow-hidden ${isFullscreen ? "fixed inset-4 z-50 flex flex-col shadow-2xl" : "relative"}`}
    >
      <div className="flex flex-col gap-3 border-b border-hairline p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <p className="eyebrow">3D tour</p>
          <h2 id="tour-heading" className="mt-1 text-xl font-semibold text-ink">
            Walk through the home
          </h2>
          <p className="mt-0.5 text-sm text-muted">Drag to look around. Room sizes were measured on site.</p>
        </div>

        <div className="flex items-center gap-2" role="toolbar" aria-label="3D view controls">
          <ToolButton active={showMeasurements} onClick={() => setShowMeasurements((v) => !v)} label="Room details">
            <Ruler className="h-4 w-4" />
          </ToolButton>
          <ToolButton active={isRotating} onClick={() => setIsRotating((v) => !v)} label="Auto-rotate">
            <RotateCw className="h-4 w-4" />
          </ToolButton>
          <ToolButton active={wireframeMode} onClick={() => setWireframeMode((v) => !v)} label="Wireframe">
            <Box className="h-4 w-4" />
          </ToolButton>
          <ToolButton active={isFullscreen} onClick={() => setIsFullscreen((v) => !v)} label={isFullscreen ? "Exit full screen" : "Full screen"}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </ToolButton>
        </div>
      </div>

      <div className={`relative w-full overflow-hidden bg-surface-2 ${isFullscreen ? "min-h-0 flex-1" : "h-[380px] sm:h-[460px]"}`}>
        {webGlSupported ? (
          <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" aria-label={`3D model of ${propertyTitle}`} role="img" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <Rotate3d className="h-8 w-8 text-muted" />
            <p className="mt-3 font-semibold text-ink">{activeRoom.name}</p>
            <p className="text-sm text-muted">
              {activeRoom.dimensions} · {activeRoom.carpetSqft} sq ft
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted">3D view isn&apos;t supported on this device. Room details are shown instead.</p>
          </div>
        )}

        {showMeasurements && (
          <div className="floating-shadow absolute left-4 top-4 z-10 max-w-xs rounded-xl bg-white/95 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-ink">{activeRoom.name}</p>
              <span className="pill-verified">{activeRoom.carpetSqft} sq ft</span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {activeRoom.dimensions} · {activeRoom.floorType}
            </p>
            <p className="mt-2 border-t border-hairline pt-2 text-xs text-muted">{activeRoom.highlight}</p>
          </div>
        )}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-hairline p-4 sm:px-7" role="tablist" aria-label="Rooms">
        {rooms.map((room, idx) => (
          <button
            key={room.id}
            type="button"
            role="tab"
            aria-selected={idx === activeRoomIndex}
            aria-pressed={idx === activeRoomIndex}
            onClick={() => setActiveRoomIndex(idx)}
            className="chip shrink-0"
          >
            {room.name}
            <span className="opacity-60">{room.dimensions}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

const ToolButton: React.FC<{ active: boolean; onClick: () => void; label: string; children: React.ReactNode }> = ({ active, onClick, label, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    aria-label={label}
    title={label}
    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors cursor-pointer ${
      active ? "bg-ink text-white" : "border border-hairline bg-white text-ink hover:bg-surface"
    }`}
  >
    {children}
  </button>
);
