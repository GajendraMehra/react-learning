import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, CreditCard, ShoppingBag, BaggageClaim, TicketPercent, LogIn } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      description: 'Browse products and explore'
    },
    {
      name: 'Products',
      path: '/products',
      icon: ShoppingBag,
      description: 'All available products'
    },
    {
      name: 'Payment',
      path: '/payment',
      icon: CreditCard,
      description: 'Payment methods and checkout'
    },
    {
      name: 'Orders',
      path: '/order',
      icon: ShoppingBag,
      description: 'Your order history'
    },
    {
      name: 'Offer',
      path: '/offer',
      icon: TicketPercent,
      description: 'Get the latest offer'
    },
    {
      name: 'Sign In',
      path: '/sign-in',
      icon: LogIn,
      description: 'Login to your existing account'
    },
    {
      name: 'Cart',
      path: '/Cart',
      icon: BaggageClaim,
      description: 'Your wishlisted products'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-surface border border-border shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-0 left-0 h-full w-64 bg-surface border-r border-border shadow-lg z-40">
        <div className="p-6">
          <h2 className="text-xl font-bold text-text mb-8">Navigation</h2>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-primary/5 ${active
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-text hover:text-primary'
                      }`}
                  >
                    <Icon size={20} />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-text-muted">{item.description}</div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <nav className="absolute top-0 right-0 h-full w-80 bg-surface border-l border-border shadow-xl">
            <div className="p-6 pt-16">
              <h2 className="text-xl font-bold text-text mb-8">Navigation</h2>
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-primary/5 ${active
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-text hover:text-primary'
                          }`}
                      >
                        <Icon size={20} />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-text-muted">{item.description}</div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navigation;