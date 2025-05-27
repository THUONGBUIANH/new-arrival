import {
  Select as SelectShadcn,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SelectOption } from '@/types/select';

type SelectProps = {
  placeholder?: string;
  options: SelectOption[];
  onValueChange?: (value: string) => void;
  value?: string;
};

const Select = ({ placeholder, options, onValueChange, value }: SelectProps) => {
  const handleValueChange = (value: string) => {
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <SelectShadcn onValueChange={handleValueChange} value={value}>
      <SelectTrigger className="border-gray-300 w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectShadcn>
  );
};

export default Select;
