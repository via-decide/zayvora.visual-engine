import React from 'react';

export function EditorLayout({ left, center, right }: { left: React.ReactNode; center: React.ReactNode; right: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
      <section>{left}</section>
      <section>{center}</section>
      <section>{right}</section>
    </div>
  );
}
