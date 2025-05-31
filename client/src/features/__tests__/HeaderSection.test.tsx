import { render, screen } from '@testing-library/react';
import HeaderSection from '@/features/HeaderSection';

describe('HeaderSection', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<HeaderSection />);
      // Use text matchers to handle text split by <br> tag
      expect(screen.getByText((_content, element) => {
        return element?.tagName.toLowerCase() === 'h1' && 
               element?.textContent === 'NEWARRIVAL';
      })).toBeInTheDocument();
    });

    it('displays the main headline correctly', () => {
      render(<HeaderSection />);
      
      // Use text matcher to find the h1 element containing both NEW and ARRIVAL
      const heading = screen.getByText((_content, element) => {
        return element?.tagName.toLowerCase() === 'h1' && 
               element?.textContent === 'NEWARRIVAL';
      });
      
      expect(heading).toBeInTheDocument();
      expect(heading.innerHTML).toContain('NEW<br>ARRIVAL');
    });

    it('displays THE DJ label', () => {
      render(<HeaderSection />);
      
      expect(screen.getByText('THE DJ')).toBeInTheDocument();
    });

    it('renders the correct number of small placeholder images', () => {
      const { container } = render(<HeaderSection />);
      
      // Count placeholder images in the small grid (should be 4)
      const smallImages = container.querySelectorAll('.grid-cols-4 > div');
      expect(smallImages).toHaveLength(4);
    });

    it('renders one large featured image', () => {
      const { container } = render(<HeaderSection />);
      
      // The large featured image should have aspect-[4/5] class
      const largeImage = container.querySelector('.aspect-\\[4\\/5\\]');
      expect(largeImage).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('has proper main container structure', () => {
      const { container } = render(<HeaderSection />);
      
      // Main container with gray background
      const mainContainer = container.querySelector('.bg-gray-50');
      expect(mainContainer).toBeInTheDocument();
      
      // Max width container
      const maxWidthContainer = container.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();
      
      // Grid layout
      const gridContainer = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
      expect(gridContainer).toBeInTheDocument();
    });

    it('has proper left side layout structure', () => {
      const { container } = render(<HeaderSection />);
      
      // Left side content should have space-y-6 class
      const leftSide = container.querySelector('.space-y-6');
      expect(leftSide).toBeInTheDocument();
      
      // Small images grid
      const smallGrid = container.querySelector('.grid-cols-4');
      expect(smallGrid).toBeInTheDocument();
    });

    it('has proper right side layout structure', () => {
      const { container } = render(<HeaderSection />);
      
      // Right side with relative positioning
      const rightSide = container.querySelector('.relative');
      expect(rightSide).toBeInTheDocument();
      
      // Featured image with correct aspect ratio
      const featuredImage = container.querySelector('.aspect-\\[4\\/5\\]');
      expect(featuredImage).toBeInTheDocument();
    });
  });

  describe('Typography and Styling', () => {
    it('applies correct typography classes to headline', () => {
      render(<HeaderSection />);
      
      // Use text matcher to handle text split by <br> tag
      const headline = screen.getByText((_content, element) => {
        return element?.tagName.toLowerCase() === 'h1' && 
               element?.textContent === 'NEWARRIVAL';
      });
      expect(headline).toHaveClass('text-6xl', 'font-bold', 'text-gray-700', 'leading-tight');
    });

    it('applies correct styling to THE DJ label', () => {
      render(<HeaderSection />);
      
      const djLabel = screen.getByText('THE DJ');
      expect(djLabel).toHaveClass('text-gray-600', 'font-medium');
      
      // Check parent container styling
      const djContainer = djLabel.closest('.bg-white');
      expect(djContainer).toHaveClass('bg-white', 'border', 'border-gray-300', 'px-4', 'py-2', 'text-center');
    });

    it('applies correct border styling to image placeholders', () => {
      const { container } = render(<HeaderSection />);
      
      // All image placeholders should have border-2 and border-gray-300
      const placeholders = container.querySelectorAll('.border-2.border-gray-300');
      expect(placeholders.length).toBeGreaterThan(0);
    });
  });

  describe('Visual Elements', () => {
    it('renders placeholder cross lines in small images', () => {
      const { container } = render(<HeaderSection />);
      
      // Each small placeholder should have cross lines (2 per image, 4 images = 8 lines)
      const crossLines = container.querySelectorAll('.grid-cols-4 .rotate-45, .grid-cols-4 .-rotate-45');
      expect(crossLines.length).toBe(8); // 2 lines per small image × 4 images
    });

    it('renders placeholder cross lines in large image', () => {
      const { container } = render(<HeaderSection />);
      
      // Large image should have cross lines
      const largeCrossLines = container.querySelectorAll('.aspect-\\[4\\/5\\] .rotate-45, .aspect-\\[4\\/5\\] .-rotate-45');
      expect(largeCrossLines.length).toBe(2); // 2 lines for the large image
    });

    it('positions THE DJ label correctly', () => {
      render(<HeaderSection />);
      
      const djLabelContainer = screen.getByText('THE DJ').closest('.absolute');
      expect(djLabelContainer).toHaveClass('absolute', 'bottom-4', 'left-4', 'right-4');
    });
  });

  describe('Responsive Design', () => {
    it('has responsive grid classes', () => {
      const { container } = render(<HeaderSection />);
      
      const gridContainer = container.querySelector('.grid-cols-1');
      expect(gridContainer).toHaveClass('lg:grid-cols-2');
    });

    it('applies proper spacing classes', () => {
      const { container } = render(<HeaderSection />);
      
      // Main container padding
      const mainContainer = container.querySelector('.p-8');
      expect(mainContainer).toBeInTheDocument();
      
      // Gap between grid items
      const gridWithGap = container.querySelector('.gap-8');
      expect(gridWithGap).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses semantic heading element', () => {
      render(<HeaderSection />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      // Check for the presence of both NEW and ARRIVAL in the heading content
      expect(heading.innerHTML).toContain('NEW<br>ARRIVAL');
    });

    it('has proper text contrast classes', () => {
      render(<HeaderSection />);
      
      // Use text matcher to find h1 element
      const heading = screen.getByText((_content, element) => {
        return element?.tagName.toLowerCase() === 'h1' && 
               element?.textContent === 'NEWARRIVAL';
      });
      expect(heading).toHaveClass('text-gray-700');
      
      const djLabel = screen.getByText('THE DJ');
      expect(djLabel).toHaveClass('text-gray-600');
    });
  });

  describe('Content Structure', () => {
    it('breaks headline into two lines as designed', () => {
      render(<HeaderSection />);
      
      // Both NEW and ARRIVAL should be in the same h1 but on different lines due to <br />
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.innerHTML).toContain('NEW<br>ARRIVAL');
    });

    it('has correct image placeholder structure', () => {
      const { container } = render(<HeaderSection />);
      
      // Each placeholder should have aspect-square class for small images
      const smallPlaceholders = container.querySelectorAll('.grid-cols-4 .aspect-square');
      expect(smallPlaceholders).toHaveLength(4);
      
      // Large placeholder should have aspect-[4/5] class
      const largePlaceholder = container.querySelector('.aspect-\\[4\\/5\\]');
      expect(largePlaceholder).toBeInTheDocument();
    });
  });

  describe('Design System Compliance', () => {
    it('uses consistent color palette', () => {
      const { container } = render(<HeaderSection />);
      
      // Background colors
      expect(container.querySelector('.bg-gray-50')).toBeInTheDocument();
      expect(container.querySelector('.bg-white')).toBeInTheDocument();
      
      // Border colors
      expect(container.querySelector('.border-gray-300')).toBeInTheDocument();
      
      // Text colors
      expect(container.querySelector('.text-gray-700')).toBeInTheDocument();
      expect(container.querySelector('.text-gray-600')).toBeInTheDocument();
    });

    it('uses consistent spacing system', () => {
      const { container } = render(<HeaderSection />);
      
      // Padding
      expect(container.querySelector('.p-8')).toBeInTheDocument();
      expect(container.querySelector('.px-4')).toBeInTheDocument();
      expect(container.querySelector('.py-2')).toBeInTheDocument();
      
      // Gaps
      expect(container.querySelector('.gap-8')).toBeInTheDocument();
      expect(container.querySelector('.gap-4')).toBeInTheDocument();
      
      // Spacing
      expect(container.querySelector('.space-y-6')).toBeInTheDocument();
    });

    it('uses consistent border styling', () => {
      const { container } = render(<HeaderSection />);
      
      // Border widths
      expect(container.querySelector('.border-2')).toBeInTheDocument();
      expect(container.querySelector('.border')).toBeInTheDocument();
      
      // All borders should use gray-300
      const elementsWithBorders = container.querySelectorAll('.border-gray-300');
      expect(elementsWithBorders.length).toBeGreaterThan(0);
    });
  });

  describe('Visual Presentation', () => {
    it('creates proper visual hierarchy', () => {
      render(<HeaderSection />);
      
      // Main headline should be largest - use text matcher for text split by br tag
      const headline = screen.getByText((_content, element) => {
        return element?.tagName.toLowerCase() === 'h1' && 
               element?.textContent === 'NEWARRIVAL';
      });
      expect(headline).toHaveClass('text-6xl', 'font-bold');
      
      // DJ label should be smaller and medium weight
      const djLabel = screen.getByText('THE DJ');
      expect(djLabel).toHaveClass('font-medium');
      expect(djLabel).not.toHaveClass('text-6xl');
    });

    it('maintains proper alignment', () => {
      const { container } = render(<HeaderSection />);
      
      // Grid items should be centered
      expect(container.querySelector('.items-center')).toBeInTheDocument();
      
      // DJ label should be centered
      expect(screen.getByText('THE DJ').closest('.text-center')).toBeInTheDocument();
      
      // Cross lines should be centered in their containers
      expect(container.querySelector('.flex.items-center.justify-center')).toBeInTheDocument();
    });
  });
}); 