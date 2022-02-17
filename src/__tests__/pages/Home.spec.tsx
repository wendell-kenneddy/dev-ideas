import { render, screen } from '@testing-library/react';

import { mocked } from 'jest-mock';

import { useSession } from 'next-auth/react';

import Home from '../../pages';

jest.mock('next-auth/react');

describe('Home Page', () => {
  it('should be able to render correctly', () => {
    const mockedUseSession = mocked(useSession);
    mockedUseSession.mockReturnValueOnce({
      data: {
        user: { email: 'johndoe@email.com', image: '/image' },
        expires: 'fake-expires'
      },
      status: 'authenticated'
    });

    render(<Home />);

    expect(
      screen.getByText('Manage your web app ideas intuitively.')
    ).toBeInTheDocument();
    expect(screen.getByAltText('Illustration')).toBeInTheDocument();
  });
});
