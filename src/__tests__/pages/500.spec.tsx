import { render, screen } from '@testing-library/react';

import ServerError from '../../pages/500';

describe('500 Error Page', () => {
  it('should be able to render correctly', () => {
    render(<ServerError />);

    expect(
      screen.getByText('Seems like something gone wrong on the server...')
    ).toBeInTheDocument();
    expect(
      screen.getByAltText('Location search illustration')
    ).toBeInTheDocument();
  });
});
