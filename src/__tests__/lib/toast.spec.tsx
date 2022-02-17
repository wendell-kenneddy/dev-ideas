import { mocked } from 'jest-mock';

import { toast as t } from 'react-toastify';

import { toast } from '../../lib/toast';

jest.mock('react-toastify');

describe('Toast Component', () => {
  it('should be able to render correctly', () => {
    const mockedT = mocked(t);

    toast('Something', 'success');

    expect(mockedT.dismiss).toHaveBeenCalled();

    expect(mockedT).toHaveBeenCalledWith('Something', {
      type: 'success',
      position: 'top-right',
      autoClose: 3000,
      theme: 'dark'
    });
  });
});
