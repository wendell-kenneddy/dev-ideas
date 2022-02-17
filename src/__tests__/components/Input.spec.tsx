import { render, screen } from '@testing-library/react';

import { FieldError } from 'react-hook-form';

import { Input } from '../../components/Input';

describe('Input Component', () => {
  it('should be able to render correctly', () => {
    render(<Input label="My Input" labelFor="my-input" fillAttributes />);

    expect(
      screen.getByRole('textbox', {
        name: 'My Input'
      })
    ).toBeInTheDocument();
    expect(screen.getByText('My Input')).toBeInTheDocument();
  });

  it('should not have a name and id if fillAttributes is false', () => {
    render(<Input label="My Input" labelFor="my-input" />);

    expect(screen.getByRole('textbox')).not.toHaveAttribute('name', 'My Input');
    expect(screen.getByRole('textbox')).not.toHaveAttribute('id', 'my-input');
  });

  it('should be able to render an error state', () => {
    const error: FieldError = {
      message: 'Invalid input',
      type: 'required'
    };

    render(
      <Input
        label="My Input"
        labelFor="my-input"
        error={error}
        fillAttributes
      />
    );

    expect(screen.getByText('Invalid input')).toBeInTheDocument();
  });
});
