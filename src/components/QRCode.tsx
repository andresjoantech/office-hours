'use client';

import { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  url: string;
  size?: number;
  className?: string;
}

export default function QRCode({ url, size = 120, className = '' }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCodeLib.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 1,
        color: {
          dark: '#1e3a5f',
          light: '#ffffff',
        },
      });
    }
  }, [url, size]);

  if (!url) return null;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <canvas ref={canvasRef} />
      <p className="text-xs mt-1 text-center max-w-[200px] break-all" style={{ color: '#4b5563' }}>
        {url}
      </p>
    </div>
  );
}
