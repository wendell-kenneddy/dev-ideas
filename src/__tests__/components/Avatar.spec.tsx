import { render, screen } from '@testing-library/react';

import { Avatar } from '../../components/Avatar';

describe('Avatar Component', () => {
  it('should be able to render correctly', () => {
    render(<Avatar src="/cat.svg" />);

    expect(screen.getByAltText('Avatar image')).toBeInTheDocument();
  });

  it('should be able to render a fallback icon when src is null', () => {
    render(<Avatar />);

    expect(screen.getByTitle('Avatar image')).toBeInTheDocument();
  });
});
