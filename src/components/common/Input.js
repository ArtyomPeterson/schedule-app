import React from 'react';

export default function Input({type, value, onChange, disabled, min, max}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      min={min}
      max={max}
    />
  );
}