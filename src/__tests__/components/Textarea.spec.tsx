import { render, screen } from '@testing-library/react';

import { FieldError } from 'react-hook-form';

import { Textarea } from '../../components/Textarea';

describe('Textarea Component', () => {
  it('should be able to render correctly', () => {
    render(
      <Textarea label="My Textarea" labelFor="my-textarea" fillAttributes />
    );

    expect(
      screen.getByRole('textbox', {
        name: 'My Textarea'
      })
    ).toBeInTheDocument();
    expect(screen.getByText('My Textarea')).toBeInTheDocument();
  });

  it('should not have a name and id if fillAttributes is false', () => {
    render(<Textarea label="My Textarea" labelFor="my-textarea" />);

    expect(screen.getByRole('textbox')).not.toHaveAttribute(
      'name',
      'My Textarea'
    );
    expect(screen.getByRole('textbox')).not.toHaveAttribute(
      'id',
      'my-textarea'
    );
  });

  it('should be able to render an error state', () => {
    const error: FieldError = {
      message: 'Invalid textarea',
      type: 'required'
    };

    render(
      <Textarea
        label="My Textarea"
        labelFor="my-textarea"
        error={error}
        fillAttributes
      />
    );

    expect(screen.getByText('Invalid textarea')).toBeInTheDocument();
  });
});
