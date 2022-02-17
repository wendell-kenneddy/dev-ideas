import { render, screen } from '@testing-library/react';

import { Button } from '../../components/Button';

describe('Button Component', () => {
  it('should be able to render correctly', () => {
    render(
      <Button variant="contained" color="primary" isLoading={false}>
        I am a button
      </Button>
    );

    expect(
      screen.getByRole('button', {
        name: 'I am a button'
      })
    ).toBeInTheDocument();
    expect(screen.getByText('I am a button')).toBeInTheDocument();
  });

  it('should be able to render a loading state', () => {
    render(
      <Button variant="outlined" color="secondary" isLoading={true}>
        I am a button
      </Button>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status').tagName.toLowerCase()).toBe('div');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should be able to disable itself when isLoading is true', () => {
    render(
      <Button variant="outlined" color="secondary" isLoading={true}>
        I am a button
      </Button>
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
