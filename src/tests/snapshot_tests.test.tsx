import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { WaitlistForm } from '../components/ui/WaitlistForm';

// Mock confetti and Lucide icons to stabilize snapshot outputs
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}));
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ to, children }: any) => <a href={to}>{children}</a>
}));
vi.mock('lucide-react', () => ({
  Lock: () => <span data-testid="lock-icon" />,
  Loader2: () => <span data-testid="loader-icon" />,
  ShieldCheck: () => <span data-testid="shield-icon" />,
  CheckCircle2: () => <span data-testid="check-icon" />,
  X: () => <span data-testid="x-icon" />
}));

describe('UI Layout Component Snapshot Tests', () => {
  it('should_match_snapshot_for_primary_button_default_state', () => {
    const { asFragment } = render(<Button variant="primary">Unlock Vault</Button>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should_match_snapshot_for_disabled_button_state', () => {
    const { asFragment } = render(<Button variant="primary" disabled>Unlocking...</Button>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should_match_snapshot_for_input_with_error_and_label', () => {
    const { asFragment } = render(
      <Input label="Email address" error="Invalid format" placeholder="user@email.com" onChange={() => {}} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should_match_snapshot_for_waitlist_form_default_state', () => {
    const { asFragment } = render(<WaitlistForm />);
    expect(asFragment()).toMatchSnapshot();
  });
});
