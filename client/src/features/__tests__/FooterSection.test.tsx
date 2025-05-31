import { render, screen, fireEvent } from '@testing-library/react';
import FooterSection from '@/features/FooterSection';

// Mock the UI components
jest.mock('@/components/ui/input', () => ({
  Input: ({ placeholder, type, className, ...props }: any) => (
    <input 
      placeholder={placeholder}
      type={type}
      className={className}
      data-testid="newsletter-input"
      {...props}
    />
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, ...props }: any) => (
    <button className={className} data-testid="newsletter-button" {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Mail: ({ className }: { className?: string }) => (
    <div data-testid="mail-icon" className={className}>✉️</div>
  ),
  MessageSquare: ({ className }: { className?: string }) => (
    <div data-testid="message-square-icon" className={className}>💬</div>
  ),
  Globe: ({ className }: { className?: string }) => (
    <div data-testid="globe-icon" className={className}>🌐</div>
  ),
}));

describe('FooterSection', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<FooterSection />);
      expect(screen.getByText('NAVIGATION')).toBeInTheDocument();
      expect(screen.getByText('CONTACT US')).toBeInTheDocument();
      expect(screen.getByText('NEWSLETTER')).toBeInTheDocument();
    });

    it('renders all main sections', () => {
      render(<FooterSection />);
      
      // Check for all three main sections
      expect(screen.getByText('NAVIGATION')).toBeInTheDocument();
      expect(screen.getByText('CONTACT US')).toBeInTheDocument();
      expect(screen.getByText('NEWSLETTER')).toBeInTheDocument();
    });

    it('renders the decorative wave element', () => {
      const { container } = render(<FooterSection />);
      
      // SVG wave should be present
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('viewBox', '0 0 1200 120');
      expect(svgElement).toHaveAttribute('preserveAspectRatio', 'none');
    });
  });

  describe('Navigation Section', () => {
    it('displays navigation heading', () => {
      render(<FooterSection />);
      
      const navHeading = screen.getByText('NAVIGATION');
      expect(navHeading).toBeInTheDocument();
      expect(navHeading.tagName).toBe('H3');
    });

    it('renders all navigation links', () => {
      render(<FooterSection />);
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Whitepaper')).toBeInTheDocument();
      expect(screen.getByText('Marketplace')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('navigation links have correct href attributes', () => {
      render(<FooterSection />);
      
      const homeLink = screen.getByText('Home').closest('a');
      const whitepaperLink = screen.getByText('Whitepaper').closest('a');
      const marketplaceLink = screen.getByText('Marketplace').closest('a');
      const aboutLink = screen.getByText('About').closest('a');
      
      expect(homeLink).toHaveAttribute('href', '#');
      expect(whitepaperLink).toHaveAttribute('href', '#');
      expect(marketplaceLink).toHaveAttribute('href', '#');
      expect(aboutLink).toHaveAttribute('href', '#');
    });

    it('navigation links have proper styling classes', () => {
      render(<FooterSection />);
      
      const homeLink = screen.getByText('Home');
      expect(homeLink).toHaveClass('block', 'text-gray-600', 'hover:text-gray-900', 'transition-colors');
    });
  });

  describe('Contact Section', () => {
    it('displays contact heading', () => {
      render(<FooterSection />);
      
      const contactHeading = screen.getByText('CONTACT US');
      expect(contactHeading).toBeInTheDocument();
      expect(contactHeading.tagName).toBe('H3');
    });

    it('renders all contact options with icons', () => {
      render(<FooterSection />);
      
      expect(screen.getByText('Website')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Discord')).toBeInTheDocument();
      
      expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
      expect(screen.getByTestId('message-square-icon')).toBeInTheDocument();
    });

    it('contact links have correct href attributes', () => {
      render(<FooterSection />);
      
      const websiteLink = screen.getByText('Website').closest('a');
      const emailLink = screen.getByText('Email').closest('a');
      const discordLink = screen.getByText('Discord').closest('a');
      
      expect(websiteLink).toHaveAttribute('href', '#');
      expect(emailLink).toHaveAttribute('href', '#');
      expect(discordLink).toHaveAttribute('href', '#');
    });

    it('contact items have proper icon container styling', () => {
      const { container } = render(<FooterSection />);
      
      const iconContainers = container.querySelectorAll('.w-8.h-8.border.border-gray-300.rounded');
      expect(iconContainers).toHaveLength(3); // Website, Email, Discord
      
      iconContainers.forEach(container => {
        expect(container).toHaveClass('flex', 'items-center', 'justify-center');
      });
    });

    it('contact links have hover effects', () => {
      render(<FooterSection />);
      
      const websiteLink = screen.getByText('Website').closest('a');
      expect(websiteLink).toHaveClass('hover:text-gray-900', 'transition-colors');
    });
  });

  describe('Newsletter Section', () => {
    it('displays newsletter heading', () => {
      render(<FooterSection />);
      
      const newsletterHeading = screen.getByText('NEWSLETTER');
      expect(newsletterHeading).toBeInTheDocument();
      expect(newsletterHeading.tagName).toBe('H3');
    });

    it('renders email input with correct attributes', () => {
      render(<FooterSection />);
      
      const emailInput = screen.getByTestId('newsletter-input');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('renders subscribe button', () => {
      render(<FooterSection />);
      
      const subscribeButton = screen.getByTestId('newsletter-button');
      expect(subscribeButton).toBeInTheDocument();
      expect(subscribeButton).toHaveTextContent('Subscribe');
    });

    it('newsletter input has proper styling', () => {
      render(<FooterSection />);
      
      const emailInput = screen.getByTestId('newsletter-input');
      expect(emailInput).toHaveClass('border-gray-300');
    });

    it('subscribe button has full width styling', () => {
      render(<FooterSection />);
      
      const subscribeButton = screen.getByTestId('newsletter-button');
      expect(subscribeButton).toHaveClass('w-full');
    });

    it('allows typing in email input', () => {
      render(<FooterSection />);
      
      const emailInput = screen.getByTestId('newsletter-input') as HTMLInputElement;
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      expect(emailInput.value).toBe('test@example.com');
    });

    it('subscribe button is clickable', () => {
      const mockClick = jest.fn();
      
      render(<FooterSection />);
      
      const subscribeButton = screen.getByTestId('newsletter-button');
      subscribeButton.onclick = mockClick;
      
      fireEvent.click(subscribeButton);
      
      expect(mockClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Layout and Structure', () => {
    it('has proper main container structure', () => {
      const { container } = render(<FooterSection />);
      
      // Main background
      const mainContainer = container.querySelector('.bg-gray-50');
      expect(mainContainer).toBeInTheDocument();
      
      // Max width container
      const maxWidthContainer = container.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();
      
      // Grid layout
      const gridContainer = container.querySelector('.grid-cols-1.md\\:grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
    });

    it('has decorative wave with proper structure', () => {
      const { container } = render(<FooterSection />);
      
      // Wave container
      const waveContainer = container.querySelector('.w-full.h-16.bg-white.relative.overflow-hidden');
      expect(waveContainer).toBeInTheDocument();
      
      // SVG positioned absolutely
      const svgElement = container.querySelector('.absolute.bottom-0.w-full.h-16');
      expect(svgElement).toBeInTheDocument();
      expect(svgElement?.tagName).toBe('svg');
    });

    it('uses responsive grid layout', () => {
      const { container } = render(<FooterSection />);
      
      const gridContainer = container.querySelector('.grid-cols-1');
      expect(gridContainer).toHaveClass('md:grid-cols-3');
    });

    it('applies proper spacing between sections', () => {
      const { container } = render(<FooterSection />);
      
      const gridContainer = container.querySelector('.gap-8');
      expect(gridContainer).toBeInTheDocument();
      
      const sectionSpacing = container.querySelector('.space-y-4');
      expect(sectionSpacing).toBeInTheDocument();
    });
  });

  describe('Typography and Styling', () => {
    it('applies correct heading styles', () => {
      render(<FooterSection />);
      
      const navHeading = screen.getByText('NAVIGATION');
      const contactHeading = screen.getByText('CONTACT US');
      const newsletterHeading = screen.getByText('NEWSLETTER');
      
      [navHeading, contactHeading, newsletterHeading].forEach(heading => {
        expect(heading).toHaveClass('font-semibold', 'text-gray-900', 'text-lg');
      });
    });

    it('uses consistent color scheme', () => {
      const { container } = render(<FooterSection />);
      
      // Background colors
      expect(container.querySelector('.bg-gray-50')).toBeInTheDocument();
      expect(container.querySelector('.bg-white')).toBeInTheDocument();
      
      // Text colors
      expect(container.querySelector('.text-gray-900')).toBeInTheDocument();
      expect(container.querySelector('.text-gray-600')).toBeInTheDocument();
      
      // Border colors
      expect(container.querySelector('.border-gray-300')).toBeInTheDocument();
    });

    it('applies proper padding and margins', () => {
      const { container } = render(<FooterSection />);
      
      // Main padding
      expect(container.querySelector('.p-8')).toBeInTheDocument();
      
      // Spacing utilities
      expect(container.querySelector('.space-y-4')).toBeInTheDocument();
      expect(container.querySelector('.space-y-3')).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('renders wave SVG with correct path', () => {
      const { container } = render(<FooterSection />);
      
      const pathElement = container.querySelector('path');
      expect(pathElement).toBeInTheDocument();
      expect(pathElement).toHaveAttribute('fill', '#f9fafb');
      expect(pathElement).toHaveAttribute('d', 'M0,60 C300,20 600,100 900,60 C1050,30 1150,80 1200,60 L1200,120 L0,120 Z');
    });

    it('positions icons correctly in contact section', () => {
      const { container } = render(<FooterSection />);
      
      const iconContainers = container.querySelectorAll('.w-8.h-8');
      expect(iconContainers).toHaveLength(3);
      
      iconContainers.forEach(iconContainer => {
        expect(iconContainer).toHaveClass('border', 'border-gray-300', 'rounded');
      });
    });
  });

  describe('Accessibility', () => {
    it('uses semantic heading elements', () => {
      render(<FooterSection />);
      
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(3);
      
      expect(headings[0]).toHaveTextContent('NAVIGATION');
      expect(headings[1]).toHaveTextContent('CONTACT US');
      expect(headings[2]).toHaveTextContent('NEWSLETTER');
    });

    it('has proper link semantics', () => {
      render(<FooterSection />);
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('email input has proper form semantics', () => {
      render(<FooterSection />);
      
      const emailInput = screen.getByTestId('newsletter-input');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');
    });

    it('has proper color contrast classes', () => {
      render(<FooterSection />);
      
      // Headings should have good contrast
      const headings = screen.getAllByRole('heading', { level: 3 });
      headings.forEach(heading => {
        expect(heading).toHaveClass('text-gray-900');
      });
      
      // Links should have accessible colors
      const homeLink = screen.getByText('Home');
      expect(homeLink).toHaveClass('text-gray-600');
    });
  });

  describe('Interactive Elements', () => {
    it('links have hover states', () => {
      render(<FooterSection />);
      
      const homeLink = screen.getByText('Home');
      const websiteLink = screen.getByText('Website').closest('a');
      
      expect(homeLink).toHaveClass('hover:text-gray-900', 'transition-colors');
      expect(websiteLink).toHaveClass('hover:text-gray-900', 'transition-colors');
    });

    it('maintains consistent interaction patterns', () => {
      render(<FooterSection />);
      
      const allLinks = screen.getAllByRole('link');
      
      allLinks.forEach(link => {
        expect(link).toHaveClass('hover:text-gray-900', 'transition-colors');
      });
    });
  });

  describe('Content Organization', () => {
    it('organizes navigation links in logical order', () => {
      render(<FooterSection />);
      
      const navSection = screen.getByText('NAVIGATION').closest('div');
      const links = navSection?.querySelectorAll('a');
      
      expect(links?.[0]).toHaveTextContent('Home');
      expect(links?.[1]).toHaveTextContent('Whitepaper');
      expect(links?.[2]).toHaveTextContent('Marketplace');
      expect(links?.[3]).toHaveTextContent('About');
    });

    it('groups contact methods appropriately', () => {
      render(<FooterSection />);
      
      const contactSection = screen.getByText('CONTACT US').closest('div');
      const contactLinks = contactSection?.querySelectorAll('a');
      
      expect(contactLinks?.[0]).toHaveTextContent('Website');
      expect(contactLinks?.[1]).toHaveTextContent('Email');
      expect(contactLinks?.[2]).toHaveTextContent('Discord');
    });

    it('structures newsletter section correctly', () => {
      render(<FooterSection />);
      
      const newsletterSection = screen.getByText('NEWSLETTER').closest('div');
      const input = newsletterSection?.querySelector('input');
      const button = newsletterSection?.querySelector('button');
      
      expect(input).toBeInTheDocument();
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Subscribe');
    });
  });
}); 