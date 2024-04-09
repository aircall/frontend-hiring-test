/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-debugging-utils */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, screen, fireEvent, RenderResult, waitFor } from '@testing-library/react';
import { Tractor } from '@aircall/tractor';
import { darkTheme } from '../../../style/theme/darkTheme';
import CallsListFilters, { CallsListFiltersProps } from './CallsListFilters';
import userEvent from '@testing-library/user-event';

// Reference: https://github.com/radix-ui/primitives/issues/420#issuecomment-1125837782
(global as any).ResizeObserver = class ResizeObserver {
  constructor(cb: any) {
    (this as any).cb = cb;
  }
  observe() {
    (this as any).cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
  }
  unobserve() {}
};

(global as any).DOMRect = {
  fromRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 })
};

const component = (
  memoryRouterInitialEntries: string[],
  props: CallsListFiltersProps
): RenderResult => {
  return render(
    <Tractor injectStyle theme={darkTheme}>
      <MemoryRouter initialEntries={memoryRouterInitialEntries}>
        <CallsListFilters {...props} />
      </MemoryRouter>
    </Tractor>
  );
};

describe('CallsListFilters component', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('should render correctly and include the entire UI elements - selects and buttons', () => {
    const { container, unmount } = component(['/calls/'], {
      onApplyFilters: () => {},
      onResetFilters: () => {}
    });

    expect(container).toBeDefined();
    expect(container.querySelector('[data-test="select-date-sort"]')).toBeInTheDocument();
    expect(container.querySelector('[data-test="select-call-types"]')).toBeInTheDocument();
    expect(container.querySelector('[name="btn-apply"]')).toBeInTheDocument();
    expect(container.querySelector('[name="btn-clear"]')).toBeInTheDocument();

    unmount();
  });

  it('should trigger handler functions when either clicking on the apply or clear button', () => {
    const onApplyFiltersFn = jest.fn();
    const onResetFiltersFn = jest.fn();

    const { container, unmount } = component(['/calls/'], {
      onApplyFilters: onApplyFiltersFn,
      onResetFilters: onResetFiltersFn
    });

    const btnApply = container.querySelector('[name="btn-apply"]');
    const btnClear = container.querySelector('[name="btn-clear"]');

    fireEvent.click(btnApply as HTMLElement);
    expect(onApplyFiltersFn).toHaveBeenCalled();

    fireEvent.click(btnClear as HTMLElement);
    expect(onResetFiltersFn).toHaveBeenCalled();

    unmount();
  });

  it('should components given default values - query params', async () => {
    const { unmount } = component(['/calls/?callTypes=voicemail&dateSort=desc'], {
      onApplyFilters: () => {},
      onResetFilters: () => {}
    });

    expect(screen.getByText('Voicemail')).toBeInTheDocument();
    expect(screen.getByText('Descending')).toBeInTheDocument();

    unmount();
  });

  /**
   * Behaviour test...
   * 1.- Select a sort option
   * 2.- Select a call type option
   * 3.- Click on apply filters
   * 4.- Check if onApplyFilters callback function was called properly
   */

  it('should select options, click on apply and call the applyFilters callback then', async () => {
    const onApplyFiltersFn = jest.fn();

    const { container, unmount } = component(['/calls/'], {
      onApplyFilters: onApplyFiltersFn,
      onResetFilters: () => {}
    });

    const selectDateSort = container.querySelector('[data-test="select-date-sort"]');
    const selectCallTypes = container.querySelector('[data-test="select-call-types"]');
    const btnApply = container.querySelector('[name="btn-apply"]');

    userEvent.click(selectDateSort as HTMLElement);
    expect(screen.getByText('Descending')).toBeInTheDocument();
    userEvent.click(screen.getByText('Descending') as HTMLElement);

    userEvent.click(selectCallTypes as HTMLElement);
    expect(screen.getByText('Voicemail')).toBeInTheDocument();
    userEvent.click(screen.getByText('Voicemail') as HTMLElement);

    userEvent.click(btnApply as HTMLElement);
    expect(onApplyFiltersFn).toHaveBeenCalledWith({ callTypes: ['voicemail'], dateSort: 'desc' });

    unmount();
  });
});
