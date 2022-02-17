import { render, screen } from '@testing-library/react';

import { LinkButton } from '../../components/LinkButton';

describe('LinkButton Component', () => {
  it('should be able to render correctly', () => {
    render(
      <LinkButton
        href="/dashboard"
        variant="contained"
        color="primary"
        isLoading={false}
      >
        I am a link button
      </LinkButton>
    );

    expect(
      screen.getByRole('button', {
        name: 'I am a link button'
      })
    ).toBeInTheDocument();

    expect(
      screen
        .getByRole('button', {
          name: 'I am a link button'
        })
        .closest('a')
    ).toHaveAttribute('href', '/dashboard');

    expect(screen.getByText('I am a link button')).toBeInTheDocument();
  });

  it('should be able to render a loading state when isLoading is true', () => {
    render(
      <LinkButton
        href="/dashboard"
        variant="outlined"
        color="secondary"
        isLoading={true}
      >
        I am a link button
      </LinkButton>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status').tagName.toLowerCase()).toBe('div');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
