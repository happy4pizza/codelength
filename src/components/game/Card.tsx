'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';


export default function Card() {
  const [text, setText] = useState('');  // Start with empty text
  const [fontSize, setFontSize] = useState(24);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini'); // Default to Gemini
  const [theme, setTheme] = useState(''); // Theme input

  // split left/right when text contains a slash
  const [textLeft, textRight] = useMemo(() => {
    const parts = text.split('/').map((s) => s.trim());
    return [parts[0] || '', parts[1] || ''];
  }, [text]);

  const fetchText = async () => {
    setIsLoading(true);
    console.log(`Fetching new card text from ${selectedModel} with theme: ${theme}...`);
    try {
      const apiEndpoint = selectedModel === 'claude' ? '/api/get-card-text-claude' : '/api/get-card-text';
      const url = theme ? `${apiEndpoint}?theme=${encodeURIComponent(theme)}` : apiEndpoint;
      const response = await fetch(url);
      const data = await response.json();
      setText(data.text || 'Default text');  // Update text from API
    } catch (error) {
      console.error('API error:', error);
      setText('Error loading text');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Recalculate font size when text changes
    const baseSize = 24;
    const reduction = Math.max(0, (text.length - 20) * 0.5);
    setFontSize(Math.max(12, baseSize - reduction));
  }, [text]);

  return (
    <div className="spin-cards-overlay" aria-hidden="true">
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '150%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        zIndex: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '8px 12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Enter theme (e.g., Temperature)"
          disabled={isLoading}
          style={{
            padding: '10px 14px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            outline: 'none',
            transition: 'all 0.2s ease',
            opacity: isLoading ? 0.6 : 1,
            minWidth: '180px',
            pointerEvents: 'auto'
          }}
        />

        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={isLoading}
          style={{
            padding: '10px 14px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            pointerEvents: 'auto',
            outline: 'none',
            transition: 'all 0.2s ease',
            opacity: isLoading ? 0.6 : 1,
            minWidth: '100px',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 8px center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '16px',
            paddingRight: '36px',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none'
          }}
        >
          <option value="gemini" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Gemini</option>
          <option value="claude" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Claude</option>
        </select>

        <button
          onClick={fetchText}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            background: isLoading
              ? 'linear-gradient(135deg, #666 0%, #999 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            pointerEvents: 'auto',
            transition: 'all 0.3s ease',
            boxShadow: isLoading
              ? '0 2px 8px rgba(0, 0, 0, 0.2)'
              : '0 4px 15px rgba(102, 126, 234, 0.4)',
            transform: isLoading ? 'scale(0.98)' : 'scale(1)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }
          }}
        >
          {isLoading ? '⏳ Generating...' : 'Generate Card'}
        </button>
      </div>

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
