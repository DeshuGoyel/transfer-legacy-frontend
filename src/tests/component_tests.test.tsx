import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { WaitlistForm } from '../components/ui/WaitlistForm';

// Mock canvas-confetti to prevent three.js / canvas errors during unit testing
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}));

// Mock react-router-dom to prevent useNavigate errors
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ to, children }: any) => <a href={to}>{children}</a>
}));

// Mock Lucide icons to prevent react rendering errors during isolated tests
vi.mock('lucide-react', () => ({
  Lock: () => <span data-testid="lock-icon" />,
  Loader2: () => <span data-testid="loader-icon" />,
  ShieldCheck: () => <span data-testid="shield-icon" />,
  CheckCircle2: () => <span data-testid="check-icon" />,
  X: () => <span data-testid="x-icon" />
}));

describe('Button UI Component Tests', () => {
  it('should_render_button_with_correct_text_label', () => {
    render(<Button>Secure Vault</Button>);
    expect(screen.getByText('Secure Vault')).toBeInTheDocument();
  });

  it('should_trigger_onClick_handler_when_user_clicks_button', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should_be_disabled_and_not_clickable_when_disabled_prop_is_passed', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click Me</Button>);
    
    const button = screen.getByText('Click Me');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('Input UI Component Tests', () => {
  it('should_display_label_and_placeholder_correctly', () => {
    render(<Input label="Master Phrase" placeholder="Enter keyphrase..." onChange={() => {}} />);
    expect(screen.getByText('Master Phrase')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter keyphrase...')).toBeInTheDocument();
  });

  it('should_render_input_error_message_when_error_prop_is_defined', () => {
    render(<Input label="Email" error="Email is invalid" onChange={() => {}} />);
    expect(screen.getByText('Email is invalid')).toBeInTheDocument();
  });
});

describe('Modal Component Tests', () => {
  it('should_not_be_rendered_when_isOpen_is_false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Secret Keys">
        <div>Sensitive Cryptographic Data</div>
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should_render_title_and_children_when_isOpen_is_true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Secret Keys">
        <div>Sensitive Cryptographic Data</div>
      </Modal>
    );
    expect(screen.getByText('Secret Keys')).toBeInTheDocument();
    expect(screen.getByText('Sensitive Cryptographic Data')).toBeInTheDocument();
  });
});

describe('WaitlistForm Component Tests', () => {
  it('should_render_email_input_field_and_submit_button_initially', () => {
    render(<WaitlistForm />);
    expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /claim/i })).toBeInTheDocument();
  });
});
