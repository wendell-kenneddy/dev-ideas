import { render, screen } from '@testing-library/react';

import { CreateIdeaButton } from '../../components/CreateIdeaButton';

describe('CreateIdeaButton Component', () => {
  it('should be able to render correctly', () => {
    render(<CreateIdeaButton />);

    expect(screen.getByTitle('Plus icon')).toBeInTheDocument();
    expect(screen.getByTitle('Plus icon').closest('a')).toHaveAttribute(
      'href',
      '/ideas'
    );
  });
});
