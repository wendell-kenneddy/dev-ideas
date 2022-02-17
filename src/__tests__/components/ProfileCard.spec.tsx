import { render, screen } from '@testing-library/react';

import { ProfileCard } from '../../components/ProfileCard';

describe('ProfileCard Component', () => {
  it('should be able to render correctly', () => {
    render(<ProfileCard status="Ongoing" value={119} />);

    expect(screen.getByText('Ongoing')).toBeInTheDocument();
    expect(screen.getByText('119')).toBeInTheDocument();
  });
});
