import { render, screen } from '@testing-library/react';

import { Icon } from '../../components/Icon';

describe('Icon Component', () => {
  it('should be able to render correctly', () => {
    render(<Icon />);

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByAltText('Logo').closest('a')).toHaveAttribute(
      'href',
      '/'
    );
  });
});
