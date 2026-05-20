import React from 'react';

export interface ButtonProps {
  /** Use the primary brand colour */
  primary?: boolean;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button label */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Disable the button */
  disabled?: boolean;
}

const SIZE: Record<string, React.CSSProperties> = {
  small:  { padding: '6px 14px',  fontSize: '12px' },
  medium: { padding: '10px 22px', fontSize: '14px' },
  large:  { padding: '14px 32px', fontSize: '16px' },
};

export function Button({ primary = false, size = 'medium', label, onClick, disabled = false }: ButtonProps) {
  const base: React.CSSProperties = {
    ...SIZE[size],
    display:      'inline-block',
    borderRadius: '3em',
    fontWeight:   700,
    fontFamily:   "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    lineHeight:   1,
    cursor:       disabled ? 'not-allowed' : 'pointer',
    opacity:      disabled ? 0.5 : 1,
    border:       primary ? 'none' : '2px solid #1ea7fd',
    background:   primary ? '#1ea7fd' : 'transparent',
    color:        primary ? '#fff'    : '#1ea7fd',
    transition:   'opacity 0.15s',
  };

  return (
    <button type="button" style={base} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
