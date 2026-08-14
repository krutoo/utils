import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from '../../../router/browser-router.ts';
import { RouterContext } from '../router-context.ts';
import { useNavigate } from '../use-navigate.ts';

describe('useNavigate', () => {
  test('should return navigate function', () => {
    const TestComponent = () => {
      const navigate = useNavigate();

      return (
        <div>
          <button data-marker='profile-button' onClick={() => navigate('/profile')}>
            go to profile
          </button>
          <button data-marker='back-button' onClick={() => navigate.go(-1)}>
            go back
          </button>
        </div>
      );
    };

    const router = new BrowserRouter();

    const disconnect = router.connect();

    const { getByTestId } = render(
      <RouterContext value={router}>
        <TestComponent />
      </RouterContext>,
    );

    fireEvent.click(getByTestId('profile-button'));
    expect(router.getLocation().pathname).toBe('/profile');

    fireEvent.click(getByTestId('back-button'));
    expect(router.getLocation().pathname).toBe('/');

    disconnect();
  });
});
