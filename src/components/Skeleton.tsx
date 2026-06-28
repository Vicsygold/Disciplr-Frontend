import React from 'react';
import './Skeleton.css';

/**
 * Simple skeleton placeholder component.
 * Renders a shimmering block that matches the width/height of its container.
 * Accepts optional `className` to customise size/shape.
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`skeleton ${className ?? ''}`} data-testid="skeleton" />
);

export default Skeleton;
