import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { render } from '@testing-library/react';
import { BrowserRouter } from '../../../router/browser-router.ts';
import { RouterContext } from '../router-context.ts';
import { useRouteParams } from '../use-route-params.ts';

describe('useRouteParams', () => {
  test('should return actual route params', () => {
    const TestComponent = () => {
      const { userId } = useRouteParams('/profile/:userId');

      return <div>User ID: {userId}</div>;
    };

    const router = new BrowserRouter();

    const disconnect = router.connect();

    router.navigate('/profile/1005002');

    const { container } = render(
      <RouterContext value={router}>
        <TestComponent />
      </RouterContext>,
    );

    expect(container.textContent).toBe('User ID: 1005002');

    disconnect();
  });
});
