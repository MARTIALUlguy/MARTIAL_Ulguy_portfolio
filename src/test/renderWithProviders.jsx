import { render } from '@testing-library/react';
import { AppProvider } from '../state/AppContext';

export function renderWithProviders(ui, options = {}) {
  const { providerProps, ...renderOptions } = options;
  return render(
    <AppProvider {...providerProps}>{ui}</AppProvider>,
    renderOptions
  );
}
