import { render, screen } from '@testing-library/react';

import { Profile } from '../../components/Profile';

const profile = {
  completed: 119,
  ongoing: 17,
  lastCompletedDate: '8 fev 2022'
};

describe('Profile Component', () => {
  it('should be able to render correctly', () => {
    render(<Profile profile={profile} isLoading={false} />);

    expect(screen.getByText('119')).toBeInTheDocument();
    expect(screen.getByText('17')).toBeInTheDocument();
    expect(screen.getByText('8 fev 2022')).toBeInTheDocument();
  });

  it('should be able to render a loading state if isLoading is true', () => {
    render(<Profile profile={profile} isLoading={true} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
