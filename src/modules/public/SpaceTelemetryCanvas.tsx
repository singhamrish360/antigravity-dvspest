import React, { useEffect, useRef, useState } from 'react';

export const SpaceTelemetryCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 360 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ResizeObserverClass = (window as any).ResizeObserver;
    if (!ResizeObserverClass) return;
    
    const resizeObserver = new ResizeObserverClass((entries: any[]) => {
      for (let entry of entries) {
        setDimensions({
          width: Math.floor(entry.contentRect.width || 400),
          height: 360
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationAngle = 0;

    // Define 3D stars
    const stars: { x: number; y: number; z: number; size: number }[] = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        z: Math.random() * 300 + 50,
        size: Math.random() * 1.5 + 0.5
      });
    }

    // Define Skynet Satellites in 3D orbit
    const satellites: { orbitRadius: number; speed: number; angle: number; yOffset: number; color: string }[] = [
      { orbitRadius: 110, speed: 0.015, angle: 0, yOffset: -30, color: '#f59e0b' },
      { orbitRadius: 120, speed: -0.012, angle: Math.PI / 3, yOffset: 10, color: '#f59e0b' },
      { orbitRadius: 130, speed: 0.008, angle: (2 * Math.PI) / 3, yOffset: -10, color: '#fbbf24' },
      { orbitRadius: 105, speed: -0.02, angle: Math.PI, yOffset: 25, color: '#d97706' }
    ];

    // Tracker for scanning lines
    let scanLineY = 0;
    let targetPulse = 0;

    const draw = () => {
      const { width, height } = canvas;
      ctx.fillStyle = '#090d16'; // Deep space dark blue
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 - 20;

      // 1. Draw Starfield
      ctx.fillStyle = '#ffffff';
      stars.forEach(star => {
        // Perspective projection
        const scale = 200 / star.z;
        const px = centerX + star.x * scale;
        const py = centerY + star.y * scale;
        
        // Twinkle factor
        const twinkle = Math.sin(Date.now() * 0.003 + star.z) * 0.4 + 0.6;

        if (px >= 0 && px < width && py >= 0 && py < height) {
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
          ctx.beginPath();
          ctx.arc(px, py, star.size * Math.max(0.5, scale), 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Move stars forward to simulate space travel
        star.z -= 0.3;
        if (star.z <= 10) {
          star.z = 350;
        }
      });

      // 2. Draw Holographic Glow Atmosphere behind Earth
      const atmosphereGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 90);
      atmosphereGlow.addColorStop(0, 'rgba(180, 83, 9, 0.15)'); // Golden core
      atmosphereGlow.addColorStop(0.6, 'rgba(217, 119, 6, 0.05)');
      atmosphereGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 95, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw 3D Wireframe Globe (Earth Grid)
      rotationAngle += 0.004;
      const radius = 70;
      const numLines = 10;

      ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)'; // Hologram gold grid
      ctx.lineWidth = 1;

      // Draw latitude lines (horizontal circles projected to ellipses)
      for (let i = 1; i < numLines; i++) {
        const latAngle = (Math.PI * i) / numLines;
        const latRadius = radius * Math.sin(latAngle);
        const y = centerY + radius * Math.cos(latAngle);

        ctx.beginPath();
        ctx.ellipse(centerX, y, latRadius, latRadius * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw longitude lines (meridian lines rotating in 3D)
      for (let i = 0; i < numLines; i++) {
        const lonAngle = (Math.PI * 2 * i) / numLines + rotationAngle;
        
        ctx.beginPath();
        // Draw standard meridians by projecting arcs
        for (let j = 0; j <= 20; j++) {
          const latAngle = (Math.PI * j) / 20;
          const x = centerX + radius * Math.sin(latAngle) * Math.sin(lonAngle);
          const y = centerY + radius * Math.cos(latAngle);

          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw Earth outer circular shield contour
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Draw Skynet Constellation Orbits and Satellite Nodes
      const satCoords: { x: number; y: number }[] = [];

      satellites.forEach(sat => {
        sat.angle += sat.speed;
        
        // Calculate 3D satellite position projected to 2D
        const x3d = Math.cos(sat.angle) * sat.orbitRadius;
        const z3d = Math.sin(sat.angle) * sat.orbitRadius;
        const y3d = sat.yOffset + (Math.sin(sat.angle * 2) * 15); // wavy orbit

        // Simple 3D projection
        const scale = 250 / (250 + z3d);
        const satX = centerX + x3d * scale;
        const satY = centerY + y3d * scale;

        // Save projected coordinates for links
        satCoords.push({ x: satX, y: satY });

        // Draw Orbit Paths
        ctx.strokeStyle = z3d > 0 ? 'rgba(217, 119, 6, 0.08)' : 'rgba(217, 119, 6, 0.18)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + sat.yOffset * scale, sat.orbitRadius * scale, sat.orbitRadius * 0.25 * scale, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Draw Satellite Node glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = sat.color;
        ctx.fillStyle = sat.color;
        ctx.beginPath();
        ctx.arc(satX, satY, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow

        // Draw small label tag next to satellite
        ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
        ctx.font = '8px monospace';
        ctx.fillText(`SKYNET-N${Math.floor(sat.orbitRadius)}`, satX + 6, satY - 2);
      });

      // 5. Draw Inter-Satellite Laser Mesh Links
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < satCoords.length; i++) {
        for (let j = i + 1; j < satCoords.length; j++) {
          ctx.beginPath();
          ctx.moveTo(satCoords[i].x, satCoords[i].y);
          ctx.lineTo(satCoords[j].x, satCoords[j].y);
          ctx.stroke();
        }
      }

      // 6. Draw Lucknow Telemetry Beacon & Laser Lock
      // Let's place Lucknow at a fixed point on the sphere (e.g. coordinates: centerX + 20, centerY + 15)
      const lkoX = centerX + 22;
      const lkoY = centerY + 12;

      // Pulse ring for Lucknow Target
      targetPulse += 0.05;
      const pulseSize = 6 + Math.sin(targetPulse) * 4;
      ctx.strokeStyle = '#ef4444'; // Red alert target lock
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(lkoX, lkoY, pulseSize, 0, Math.PI * 2);
      ctx.stroke();

      // Target lock dot
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(lkoX, lkoY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Laser lock from closest satellite
      if (satCoords.length > 0) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)'; // Red laser lock
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(satCoords[0].x, satCoords[0].y); // Lock from Sat 0
        ctx.lineTo(lkoX, lkoY);
        ctx.stroke();

        // Laser impact splash
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.beginPath();
        ctx.arc(lkoX, lkoY, 1.5 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. Sci-Fi HUD Overlays & Grid Lines
      // Corner brackets
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
      ctx.lineWidth = 1.5;
      const bracketSize = 12;
      
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(15, 15 + bracketSize); ctx.lineTo(15, 15); ctx.lineTo(15 + bracketSize, 15);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(width - 15, 15 + bracketSize); ctx.lineTo(width - 15, 15); ctx.lineTo(width - 15 - bracketSize, 15);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(15, height - 15 - bracketSize); ctx.lineTo(15, height - 15); ctx.lineTo(15 + bracketSize, height - 15);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(width - 15, height - 15 - bracketSize); ctx.lineTo(width - 15, height - 15); ctx.lineTo(width - 15 - bracketSize, height - 15);
      ctx.stroke();

      // Telemetry Data Text
      ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
      ctx.font = '10px Courier New, monospace';
      
      ctx.fillText('📡 SKYNET SHIELD: ACTIVE', 25, 30);
      ctx.fillText(`🛰️ ORBITAL NODES: 0${satellites.length}/04`, 25, 45);
      ctx.fillText('⚡ LKO TELEMETRY LINK: ESTABLISHED', 25, 60);

      // Target Coordinates
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      if (width < 480) {
        ctx.fillText('🎯 TARGET LOCK: HAZRATGANJ HQ', 25, 80);
        ctx.fillText('📍 COORDS: 26.8467° N | 80.9462° E', 25, 95);
      } else {
        ctx.fillText('🎯 TARGET LOCK: HAZRATGANJ HQ', width - 175, 30);
        ctx.fillText('📍 COORDS: 26.8467° N | 80.9462° E', width - 175, 45);
      }

      // Scanning Bar Overlay
      scanLineY += 1.5;
      if (scanLineY > height) scanLineY = 0;
      ctx.fillStyle = 'rgba(217, 119, 6, 0.03)';
      ctx.fillRect(0, scanLineY - 2, width, 4);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '360px', 
        borderRadius: 'var(--radius-md)', 
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
      }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  );
};
