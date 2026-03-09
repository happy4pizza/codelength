'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';


export default function Card() {
  const [text, setText] = useState('Loading...');  // Default loading text
  const [fontSize, setFontSize] = useState(24);

  // split left/right when text contains a slash
  const [textLeft, textRight] = useMemo(() => {
    const parts = text.split('/').map((s) => s.trim());
    return [parts[0] || '', parts[1] || ''];
  }, [text]);

  useEffect(() => {
    // Example API call (replace with your actual endpoint)
    const fetchText = async () => {
      try {
        const response = await fetch('/api/get-card-text');  // Your API URL
        const data = await response.json();
        setText(data.text || 'Default text');  // Update text from API
      } catch (error) {
        console.error('API error:', error);
        setText('Error loading text');
      }
    };

    fetchText();
  }, []);  // Empty array: runs once on mount

  useEffect(() => {
    // Recalculate font size when text changes
    const baseSize = 24;
    const reduction = Math.max(0, (text.length - 20) * 0.5);
    setFontSize(Math.max(12, baseSize - reduction));
  }, [text]);

  return (
    <div className="spin-cards-overlay" aria-hidden="true">
      <div className="spin-cards">

        <span style={{
          position: 'absolute',
          paddingLeft: 10,
          paddingRight: 10,
          zIndex: 1,
          width: '50%',
          height: '80%',
          color: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: `${fontSize}px`,  // Use dynamic size
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          overflow: 'hidden'
        }}>
          {textLeft}
        </span>

        <span style={{
          position: 'absolute',
          paddingLeft: 10,
          paddingRight: 10,
          left: '50%',
          zIndex: 1,
          width: '50%',
          height: '80%',
          color: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: `${fontSize}px`,  // Use dynamic size
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          overflow: 'hidden'
        }}>
          {textRight}
        </span>

        <Image
          src="/cards.svg"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 72vw, 280px"
          draggable={false}
        />
      </div>
    </div>
  );
}
