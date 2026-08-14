import { describe, test } from 'node:test';
import { act } from 'react';
import { expect } from '@std/expect';
import { render } from '@testing-library/react';
import { BrowserRouter } from '../../../router/browser-router.ts';
import { RouterContext } from '../router-context.ts';
import { useLocation } from '../use-location.ts';

describe('useLocation', () => {
  test('should return actual location', () => {
    const TestComponent = () => {
      const location = useLocation();

      return (
        <div>
          <span>pathname: {location.pathname}</span>
        </div>
      );
    };

    const router = new BrowserRouter();

    const disconnect = router.connect();

    const { container } = render(
      <RouterContext value={router}>
        <TestComponent />
      </RouterContext>,
    );

    expect(container.textContent).toBe('pathname: /');

    act(() => {
      router.navigate('/hello/world');
    });

    expect(container.textContent).toBe('pathname: /hello/world');

    disconnect();
  });
});
