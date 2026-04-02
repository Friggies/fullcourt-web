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
    categories: ['Team', 'Defense'],
    players: 5,
    premium: false,
    description: '',
    link: '',
  },
  {
    id: 3,
    name: 'Form Shooting',
    type: 'Drill',
    categories: ['Shooting'],
    players: 1,
    premium: false,
    description: '',
    link: '',
  },
];

test('filters drills using search UI', async () => {
  //Arrange
  const user = userEvent.setup();
  render(<DrillGridClient initialDrills={mockDrills} />);

  //Assert
  expect(screen.getByText('Pick & Roll')).toBeInTheDocument();
  expect(screen.getByText('Zone Defense')).toBeInTheDocument();

  //Act
  const search = screen.getByPlaceholderText('Search...');
  await user.type(search, 'zone');

  //Assert
  expect(screen.getByText('Zone Defense')).toBeInTheDocument();
  expect(screen.queryByText('Pick & Roll')).not.toBeInTheDocument();
});

test('toggles the filters panel open and closed', async () => {
  //Arrange
  const user = userEvent.setup();
  render(<DrillGridClient initialDrills={mockDrills} />);

  //Assert
  expect(screen.queryByText('Clear filters')).not.toBeInTheDocument();

  //Act
  await user.click(screen.getByRole('button', { name: 'Filters' }));

  //Assert
  expect(screen.getByText('Clear filters')).toBeInTheDocument();

  //Act
  await user.click(screen.getByRole('button', { name: 'Filters' }));

  //Assert
  expect(screen.queryByText('Clear filters')).not.toBeInTheDocument();
});

test('filters drills by type', async () => {
  //Arrange
  const user = userEvent.setup();
  render(<DrillGridClient initialDrills={mockDrills} />);
  await user.click(screen.getByRole('button', { name: 'Filters' }));

  //Act
  const typeSelect = screen.getByLabelText('Type');
  await user.selectOptions(typeSelect, 'Play');

  //Assert
  expect(screen.getByText('Zone Defense')).toBeInTheDocument();
  expect(screen.queryByText('Pick & Roll')).not.toBeInTheDocument();
  expect(screen.queryByText('Form Shooting')).not.toBeInTheDocument();
});

test('filters drills by categories (multi-select)', async () => {
  //Arrange
  const user = userEvent.setup();
  render(<DrillGridClient initialDrills={mockDrills} />);
  await user.click(screen.getByRole('button', { name: 'Filters' }));

  //Act
  const categoriesSelect = screen.getByLabelText('Categories');
  await user.selectOptions(categoriesSelect, ['Shooting']);

  //Assert
  expect(screen.getByText('Form Shooting')).toBeInTheDocument();
  expect(screen.queryByText('Pick & Roll')).not.toBeInTheDocument();
  expect(screen.queryByText('Zone Defense')).not.toBeInTheDocument();
});

test('filters drills by max players', async () => {
  //Arrange
  const user = userEvent.setup();
  render(<DrillGridClient initialDrills={mockDrills} />);
  await user.click(screen.getByRole('button', { name: 'Filters' }));

  //Act
  const playersInput = screen.getByLabelText('Players');
  await user.clear(playersInput);
  await user.type(playersInput, '2');

  //Assert
  expect(screen.getByText('Form Shooting')).toBeInTheDocument();
  expect(screen.queryByText('Pick & Roll')).not.toBeInTheDocument();
  expect(screen.queryByText('Zone Defense')).not.toBeInTheDocument();
});

test('clears type/category/player filters (but does not affect search)', async () => {
  //Arrange
  const user = userEvent.setup();
  render(<DrillGridClient initialDrills={mockDrills} />);
  await user.click(screen.getByRole('button', { name: 'Filters' }));
  const categoriesSelect = screen.getByLabelText('Categories');
  const typeSelect = screen.getByLabelText('Type');
  const playersInput = screen.getByLabelText('Players');
  await user.selectOptions(categoriesSelect, ['Shooting']);
  await user.selectOptions(typeSelect, 'Drill');
  await user.clear(playersInput);
  await user.type(playersInput, '1');

  //Assert precondition
  expect(screen.getByText('Form Shooting')).toBeInTheDocument();
  expect(screen.queryByText('Pick & Roll')).not.toBeInTheDocument();

  //Act
  await user.click(screen.getByRole('button', { name: 'Clear filters' }));

  //Assert
  expect(screen.getByText('Pick & Roll')).toBeInTheDocument();
  expect(screen.getByText('Zone Defense')).toBeInTheDocument();
  expect(screen.getByText('Form Shooting')).toBeInTheDocument();
});

test('shows an empty state when no drills match', async () => {
  //Arrange
  const user = userEvent.setup();
  render(<DrillGridClient initialDrills={mockDrills} />);

  //Act
  await user.type(
    screen.getByPlaceholderText('Search...'),
    'this will not match'
  );

  //Assert
  expect(screen.getByText('No drills found')).toBeInTheDocument();
});
