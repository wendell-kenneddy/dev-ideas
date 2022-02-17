import { render, screen } from '@testing-library/react';

import { Spinner } from '../../components/Spinner';

describe('Spinner Component', () => {
  it('should be able to render correctly', () => {
    render(<Spinner />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
