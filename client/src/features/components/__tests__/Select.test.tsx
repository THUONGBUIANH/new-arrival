import { render, screen, fireEvent } from '@testing-library/react';
import Select from '@/features/components/Select';
import type { SelectOption } from '@/types/select';

// Mock the ui Select components
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: any) => (
    <div data-testid="select-root" data-value={value || ''}>
      <button 
        data-testid="select-button"
        onClick={() => onValueChange && onValueChange('test-value')}
      >
        {children}
      </button>
    </div>
  ),
  SelectContent: ({ children }: any) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value, ...props }: any) => (
    <div 
      data-testid={`select-item-${value}`} 
      data-value={value}
      onClick={() => props.onSelect && props.onSelect(value)}
      {...props}
    >
      {children}
    </div>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <div data-testid="select-trigger" className={className}>
      {children}
    </div>
  ),
  SelectValue: ({ placeholder }: any) => (
    <span data-testid="select-value">{placeholder}</span>
  ),
}));

const mockOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select Component', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Select options={mockOptions} />);
      
      expect(screen.getByTestId('select-root')).toBeInTheDocument();
      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('select-content')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      const placeholder = 'Choose an option';
      render(<Select options={mockOptions} placeholder={placeholder} />);
      
      expect(screen.getByText(placeholder)).toBeInTheDocument();
      expect(screen.getByTestId('select-value')).toHaveTextContent(placeholder);
    });

    it('renders without placeholder', () => {
      render(<Select options={mockOptions} />);
      
      // Should still render select value component
      expect(screen.getByTestId('select-value')).toBeInTheDocument();
    });

    it('applies correct CSS classes to trigger', () => {
      render(<Select options={mockOptions} />);
      
      const trigger = screen.getByTestId('select-trigger');
      expect(trigger).toHaveClass('border-gray-300', 'w-full');
    });
  });

  describe('Options Rendering', () => {
    it('renders all provided options', () => {
      render(<Select options={mockOptions} />);
      
      mockOptions.forEach(option => {
        expect(screen.getByTestId(`select-item-${option.value}`)).toBeInTheDocument();
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('renders options with correct values and labels', () => {
      render(<Select options={mockOptions} />);
      
      const option1 = screen.getByTestId('select-item-option1');
      expect(option1).toHaveAttribute('data-value', 'option1');
      expect(option1).toHaveTextContent('Option 1');

      const option2 = screen.getByTestId('select-item-option2');
      expect(option2).toHaveAttribute('data-value', 'option2');
      expect(option2).toHaveTextContent('Option 2');
    });

    it('handles empty options array', () => {
      render(<Select options={[]} />);
      
      expect(screen.getByTestId('select-root')).toBeInTheDocument();
      expect(screen.getByTestId('select-content')).toBeInTheDocument();
      
      // No option items should be rendered
      expect(screen.queryByTestId(/select-item-/)).not.toBeInTheDocument();
    });

    it('handles undefined options gracefully', () => {
      // TypeScript would normally prevent this, but testing runtime behavior
      render(<Select options={undefined as any} />);
      
      expect(screen.getByTestId('select-root')).toBeInTheDocument();
      expect(screen.queryByTestId(/select-item-/)).not.toBeInTheDocument();
    });
  });

  describe('Value Handling', () => {
    it('renders with controlled value', () => {
      render(<Select options={mockOptions} value="option2" />);
      
      const selectRoot = screen.getByTestId('select-root');
      expect(selectRoot).toHaveAttribute('data-value', 'option2');
    });

    it('renders without initial value', () => {
      render(<Select options={mockOptions} />);
      
      const selectRoot = screen.getByTestId('select-root');
      expect(selectRoot).toHaveAttribute('data-value', '');
    });

    it('updates value when controlled', () => {
      const { rerender } = render(<Select options={mockOptions} value="option1" />);
      
      let selectRoot = screen.getByTestId('select-root');
      expect(selectRoot).toHaveAttribute('data-value', 'option1');

      rerender(<Select options={mockOptions} value="option3" />);
      
      selectRoot = screen.getByTestId('select-root');
      expect(selectRoot).toHaveAttribute('data-value', 'option3');
    });
  });

  describe('Event Handling', () => {
    it('calls onValueChange when value changes', () => {
      const mockOnValueChange = jest.fn();
      render(<Select options={mockOptions} onValueChange={mockOnValueChange} />);
      
      const button = screen.getByTestId('select-button');
      fireEvent.click(button);
      
      expect(mockOnValueChange).toHaveBeenCalledWith('test-value');
    });

    it('does not crash when onValueChange is not provided', () => {
      render(<Select options={mockOptions} />);
      
      const button = screen.getByTestId('select-button');
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('handles multiple value changes', () => {
      const mockOnValueChange = jest.fn();
      render(<Select options={mockOptions} onValueChange={mockOnValueChange} />);
      
      const button = screen.getByTestId('select-button');
      
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockOnValueChange).toHaveBeenCalledTimes(3);
      expect(mockOnValueChange).toHaveBeenCalledWith('test-value');
    });
  });

  describe('Props Combinations', () => {
    it('works with all props provided', () => {
      const mockOnValueChange = jest.fn();
      const placeholder = 'Select option';
      const value = 'option2';

      render(
        <Select
          options={mockOptions}
          placeholder={placeholder}
          onValueChange={mockOnValueChange}
          value={value}
        />
      );

      expect(screen.getByText(placeholder)).toBeInTheDocument();
      expect(screen.getByTestId('select-root')).toHaveAttribute('data-value', value);
      
      const button = screen.getByTestId('select-button');
      fireEvent.click(button);
      
      expect(mockOnValueChange).toHaveBeenCalledWith('test-value');
    });

    it('works with minimal props', () => {
      render(<Select options={mockOptions} />);
      
      expect(screen.getByTestId('select-root')).toBeInTheDocument();
      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
      mockOptions.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });
  });

  describe('Component Integration', () => {
    it('integrates correctly with shadcn Select components', () => {
      render(<Select options={mockOptions} placeholder="Test placeholder" />);
      
      // Check that all expected components are rendered
      expect(screen.getByTestId('select-root')).toBeInTheDocument();
      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('select-value')).toBeInTheDocument();
      expect(screen.getByTestId('select-content')).toBeInTheDocument();
      
      // Check placeholder is passed through
      expect(screen.getByText('Test placeholder')).toBeInTheDocument();
    });

    it('passes through className to SelectTrigger', () => {
      render(<Select options={mockOptions} />);
      
      const trigger = screen.getByTestId('select-trigger');
      expect(trigger).toHaveClass('border-gray-300', 'w-full');
    });
  });

  describe('Dynamic Options', () => {
    it('updates when options change', () => {
      const initialOptions = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
      ];

      const { rerender } = render(<Select options={initialOptions} />);
      
      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.getByText('Option B')).toBeInTheDocument();
      expect(screen.queryByText('Option C')).not.toBeInTheDocument();

      const newOptions = [
        { value: 'a', label: 'Option A' },
        { value: 'c', label: 'Option C' },
      ];

      rerender(<Select options={newOptions} />);
      
      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.queryByText('Option B')).not.toBeInTheDocument();
      expect(screen.getByText('Option C')).toBeInTheDocument();
    });

    it('handles options with special characters', () => {
      const specialOptions = [
        { value: 'special-1', label: 'Option with spaces' },
        { value: 'special-2', label: 'Option with "quotes"' },
        { value: 'special-3', label: 'Option with & symbols' },
      ];

      render(<Select options={specialOptions} />);
      
      expect(screen.getByText('Option with spaces')).toBeInTheDocument();
      expect(screen.getByText('Option with "quotes"')).toBeInTheDocument();
      expect(screen.getByText('Option with & symbols')).toBeInTheDocument();
    });

    it('handles options with duplicate labels', () => {
      const duplicateOptions = [
        { value: 'unique-1', label: 'Same Label' },
        { value: 'unique-2', label: 'Same Label' },
      ];

      render(<Select options={duplicateOptions} />);
      
      expect(screen.getByTestId('select-item-unique-1')).toBeInTheDocument();
      expect(screen.getByTestId('select-item-unique-2')).toBeInTheDocument();
      expect(screen.getAllByText('Same Label')).toHaveLength(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles very long option labels', () => {
      const longOptions = [
        { 
          value: 'long', 
          label: 'This is a very long option label that might overflow or cause layout issues' 
        },
      ];

      render(<Select options={longOptions} />);
      
      expect(screen.getByText(longOptions[0].label)).toBeInTheDocument();
    });

    it('handles empty string values', () => {
      const emptyValueOptions = [
        { value: '', label: 'Empty Value Option' },
        { value: 'normal', label: 'Normal Option' },
      ];

      render(<Select options={emptyValueOptions} />);
      
      expect(screen.getByTestId('select-item-')).toBeInTheDocument();
      expect(screen.getByTestId('select-item-normal')).toBeInTheDocument();
    });

    it('handles numeric-like string values', () => {
      const numericOptions = [
        { value: '0', label: 'Zero' },
        { value: '123', label: 'One Two Three' },
        { value: '-1', label: 'Negative One' },
      ];

      render(<Select options={numericOptions} />);
      
      expect(screen.getByTestId('select-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('select-item-123')).toBeInTheDocument();
      expect(screen.getByTestId('select-item--1')).toBeInTheDocument();
    });
  });
}); 