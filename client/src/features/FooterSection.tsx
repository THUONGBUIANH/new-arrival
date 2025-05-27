import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Globe } from 'lucide-react';

const FooterSection = () => {
  return (
    <div className="w-full bg-gray-50">
      {/* Decorative wave */}
      <div className="w-full h-16 bg-white relative overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C300,20 600,100 900,60 C1050,30 1150,80 1200,60 L1200,120 L0,120 Z"
            fill="#f9fafb"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">NAVIGATION</h3>
            <nav className="space-y-3">
              <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Whitepaper
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Marketplace
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
            </nav>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">CONTACT US</h3>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                Website
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                Email
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                Discord
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">NEWSLETTER</h3>
            <div className="space-y-3">
              <Input placeholder="Enter your email" type="email" className="border-gray-300" />
              <Button className="w-full">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
