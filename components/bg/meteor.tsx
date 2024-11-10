"use client"
import React, { useRef, useEffect } from 'react';

const MeteorShower: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const meteors: { x: number; y: number; length: number; speed: number; angle: number; opacity: number }[] = [];

    function createMeteor() {
      const x = Math.random() * width;
      const y = Math.random() * height / 2;
      const length = Math.random() * 80 + 10;
      const speed = Math.random() * 5 + 2; // 调整速度
      const angle = Math.PI / 4; // 45 degrees
      const opacity = Math.random() * 0.5 + 0.5;
      meteors.push({ x, y, length, speed, angle, opacity });
    }

    function drawMeteor(meteor: { x: number; y: number; length: number; speed: number; angle: number; opacity: number }) {
      // Draw the tail of the meteor
      const gradient = ctx.createLinearGradient(
        meteor.x,
        meteor.y,
        meteor.x - meteor.length * Math.cos(meteor.angle),
        meteor.y - meteor.length * Math.sin(meteor.angle)
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      ctx.lineTo(meteor.x - meteor.length * Math.cos(meteor.angle), meteor.y - meteor.length * Math.sin(meteor.angle));
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw the head of the meteor
      ctx.beginPath();
      ctx.arc(meteor.x, meteor.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 255, 255, ${meteor.opacity})`;
      ctx.fill();
    }

    function updateMeteor(meteor: { x: number; y: number; length: number; speed: number; angle: number; opacity: number }) {
      meteor.x += meteor.speed * Math.cos(meteor.angle);
      meteor.y += meteor.speed * Math.sin(meteor.angle);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      meteors.forEach((meteor, index) => {
        drawMeteor(meteor);
        updateMeteor(meteor);
        if (meteor.x > width || meteor.y > height) {
          meteors.splice(index, 1);
        }
      });
      if (meteors.length < 50) { // 调整流星数量
        createMeteor();
      }
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default MeteorShower;