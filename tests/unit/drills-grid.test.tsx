import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DrillGridClient from '@/components/features/Drill/DrillGridClient';
import { Drill } from '@/lib/types';

const mockDrills: Drill[] = [
  {
    id: 1,
    name: 'Pick & Roll',
    type: 'Drill',
    categories: ['Team'],
    players: 5,
    premium: false,
    description: '',
    link: '',
  },
  {
    id: 2,
    name: 'Zone Defense',
    type: 'Play',
    categories: ['Team'],
    players: 5,
    premium: false,
    description: '',
    link: '',
  },
];

test('filters drills using search UI', async () => {
  const user = userEvent.setup();

  render(<DrillGridClient initialDrills={mockDrills} />);

  expect(screen.getByText('Pick & Roll')).toBeInTheDocument();
  expect(screen.getByText('Zone Defense')).toBeInTheDocument();

  const search = screen.getByPlaceholderText('Search...');
  await user.type(search, 'zone');

  expect(screen.getByText('Zone Defense')).toBeInTheDocument();
  expect(screen.queryByText('Pick & Roll')).not.toBeInTheDocument();
});
