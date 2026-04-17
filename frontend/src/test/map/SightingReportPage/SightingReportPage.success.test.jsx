import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SightingReportPage from '../../../features/map/ui/SightingReportPage.jsx';

vi.mock('../../../features/api/theftReportApi.js', () => ({
  createSightingForReport: vi.fn(() => Promise.resolve({ id: 1 }))
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SightingReportPage - successful submit', () => {
  it('kutsuu onCreated-callbackia onnistuneen tallennuksen jalkeen', async () => {
    const onCreated = vi.fn();

    render(
      <SightingReportPage
        reportId="abc123"
        defaultLocation={{ latitude: 60.17, longitude: 24.94 }}
        onCreated={onCreated}
      />
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Pyora nakyi aseman vieressa.' }
    });

    fireEvent.click(
      screen.getByRole('button', { name: /L.het. havaintoilmoitus/i })
    );

    await waitFor(() => {
      expect(onCreated).toHaveBeenCalledTimes(1);
    });
  });
});
