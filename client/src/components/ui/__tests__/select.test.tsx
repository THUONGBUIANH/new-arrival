import { render, screen, fireEvent } from '@testing-library/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CheckIcon: ({ className }: { className?: string }) => (
    <div data-testid="check-icon" className={className} />
  ),
  ChevronDownIcon: ({ className }: { className?: string }) => (
    <div data-testid="chevron-down-icon" className={className} />
  ),
  ChevronUpIcon: ({ className }: { className?: string }) => (
    <div data-testid="chevron-up-icon" className={className} />
  ),
}));

describe('Select Components', () => {
  describe('SelectTrigger', () => {
    it('renders trigger with default props', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
      expect(trigger).toHaveAttribute('data-size', 'default');
    });

    it('renders trigger with small size', () => {
      render(
        <Select>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-size', 'sm');
    });

    it('renders trigger with placeholder', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose your option" />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByText('Choose your option')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('renders chevron down icon', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
    });

    it('handles disabled state', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeDisabled();
    });
  });

  describe('SelectValue', () => {
    it('renders value component with data attribute', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Test placeholder" />
          </SelectTrigger>
        </Select>
      );

      const valueElement = container.querySelector('[data-slot="select-value"]');
      expect(valueElement).toBeInTheDocument();
    });

    it('displays placeholder text', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Test placeholder" />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByText('Test placeholder')).toBeInTheDocument();
    });
  });

  describe('SelectSeparator', () => {
    it('renders separator with correct data attribute', () => {
      const { container } = render(<SelectSeparator />);

      const separator = container.querySelector('[data-slot="select-separator"]');
      expect(separator).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<SelectSeparator className="custom-separator" />);

      const separator = container.querySelector('[data-slot="select-separator"]');
      expect(separator).toHaveClass('custom-separator');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('role', 'combobox');
    });

    it('supports keyboard events', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      
      // Test that keyboard events can be fired without errors
      fireEvent.keyDown(trigger, { key: 'Enter' });
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      fireEvent.keyDown(trigger, { key: 'Escape' });

      // Just verify the component still exists after keyboard events
      expect(trigger).toBeInTheDocument();
    });
  });

  describe('Complete Select Component', () => {
    it('renders a complete select with all sub-components', () => {
      render(
        <Select defaultValue="apple">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectSeparator />
              <SelectItem value="orange" disabled>Orange</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      // Test that trigger renders
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveClass('w-48');

      // Test that the selected value is shown (Apple should be displayed)
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('renders with controlled value', () => {
      const { rerender } = render(
        <Select value="test">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test Option</SelectItem>
            <SelectItem value="other">Other Option</SelectItem>
          </SelectContent>
        </Select>
      );

      let trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();

      rerender(
        <Select value="other">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test Option</SelectItem>
            <SelectItem value="other">Other Option</SelectItem>
          </SelectContent>
        </Select>
      );

      trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
    });

    it('renders complex nested structure', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Group 1</SelectLabel>
              <SelectItem value="item1">Item 1</SelectItem>
              <SelectItem value="item2">Item 2</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Group 2</SelectLabel>
              <SelectItem value="item3">Item 3</SelectItem>
              <SelectItem value="item4" disabled>Item 4</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      // Verify the trigger is rendered
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select')).toBeInTheDocument();
    });

    it('handles different props combinations', () => {
      render(
        <Select defaultValue="default" disabled>
          <SelectTrigger size="sm" className="custom-trigger">
            <SelectValue placeholder="Won't show due to defaultValue" />
          </SelectTrigger>
          <SelectContent className="custom-content">
            <SelectItem value="default">Default Item</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute('data-size', 'sm');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('tests basic component structure', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      // Test that basic elements render
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select option')).toBeInTheDocument();

      // Test that core data attributes are present
      expect(container.querySelector('[data-slot="select-trigger"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="select-value"]')).toBeInTheDocument();
    });

    it('tests select with value displayed', () => {
      render(
        <Select defaultValue="selected">
          <SelectTrigger>
            <SelectValue placeholder="Choose option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="selected">Selected Option</SelectItem>
            <SelectItem value="other">Other Option</SelectItem>
          </SelectContent>
        </Select>
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Selected Option')).toBeInTheDocument();
    });
  });
}); 