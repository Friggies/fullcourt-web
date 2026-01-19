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

// Mock Supabase client (ARRANGE)
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: jest.fn().mockResolvedValue({ data: mockDrills, error: null }),
    }),
  }),
}));

test('filters drills using UI', async () => {
  render(<Drills />); //ACT

  expect(await screen.findByText('Pick & Roll')).toBeInTheDocument(); //ASSERT INITIIAL STATE
  expect(screen.getByText('Zone Defense')).toBeInTheDocument();

  const search = screen.getByPlaceholderText('Search...');
  await userEvent.type(search, 'zone'); //ACT

  expect(screen.getByText('Zone Defense')).toBeInTheDocument(); //ASSERT FINAL STATE
  expect(screen.queryByText('Pick & Roll')).not.toBeInTheDocument();
});
