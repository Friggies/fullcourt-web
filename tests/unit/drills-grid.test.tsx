import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Drills from '@/app/drills/page';

const mockDrills = [
  {
    name: 'Pick & Roll',
    type: 'Offense',
    categories: ['Team'],
    players: 5,
  },
  {
    name: 'Zone Defense',
    type: 'Defense',
    categories: ['Team'],
    players: 5,
  },
];

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: jest.fn().mockResolvedValue({ data: mockDrills, error: null }),
    }),
  }),
}));

test('filters drills using UI', async () => {
  render(<Drills />);

  expect(await screen.findByText('Pick & Roll')).toBeInTheDocument();
  expect(screen.getByText('Zone Defense')).toBeInTheDocument();

  const search = screen.getByPlaceholderText('Search...');
  await userEvent.type(search, 'zone');

  expect(screen.getByText('Zone Defense')).toBeInTheDocument();
  expect(screen.queryByText('Pick & Roll')).not.toBeInTheDocument();
});
