import React, { useEffect, useRef } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import './MindmapModal.css';

export default function MindmapModal({ open, onClose, markdown }) {
  const svgRef = useRef(null);
  const transformer = new Transformer();

  useEffect(() => {
    if (open && markdown && svgRef.current) {
      svgRef.current.innerHTML = ''; // Clear old SVG content
      const { root } = transformer.transform(markdown);
      Markmap.create(svgRef.current, null, root);
    }
  }, [open, markdown]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <svg
          ref={svgRef}
          style={{ width: '100%', height: '100%' }}
        ></svg>
      </div>
    </div>
  );
}
