import { render, screen } from '@testing-library/react';

import NotFound from '../../pages/404';

describe('404 Error Page', () => {
  it('should be able to render correctly', () => {
    render(<NotFound />);

    expect(
      screen.getByText('Seems like the route could not be reached...')
    ).toBeInTheDocument();
    expect(
      screen.getByAltText('Location search illustration')
    ).toBeInTheDocument();
  });
});
