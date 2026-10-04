import React from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from '../Input';
import { describe, it, expect } from 'vitest';

describe('Input Component', () => {
  it('renders correctly with a label', () => {
    render(<Input label="E-mail" placeholder="Digite seu email" />);
    expect(screen.getByText('E-mail')).toBeDefined();
    expect(screen.getByPlaceholderText('Digite seu email')).toBeDefined();
  });
});
