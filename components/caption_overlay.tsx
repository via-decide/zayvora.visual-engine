import React from 'react';

export function CaptionOverlay({ captions }: { captions: any[] }) {
  return (
    <div style={{ background: '#000', color: '#fff', padding: 8 }}>
      {captions.slice(0, 3).map((c, i) => <div key={i}>{c.text}</div>)}
    </div>
  );
}
