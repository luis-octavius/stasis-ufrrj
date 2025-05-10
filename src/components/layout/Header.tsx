"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const GreekColumnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300"
    aria-hidden="true"
    data-ai-hint="greek column"
  >
    <path d="M5 21V3H7V21H5Z" />
    <path d="M10 21V3H12V21H10Z" />
    <path d="M15 21V3H17V21H15Z" />
    <path d="M3 2H19C19.5523 2 20 2.44772 20 3V4H2V3C2 2.44772 2.44772 2 3 2Z" strokeWidth="2" fill="currentColor" className="text-primary group-hover:text-accent transition-colors duration-300" />
    <path d="M2 20V21C2 21.5523 2.44772 22 3 22H19C19.5523 22 20 21.5523 20 21V20H2Z" strokeWidth="2" fill="currentColor" className="text-primary group-hover:text-accent transition-colors duration-300"/>
  </svg>
);


export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { href: '/', label: 'INÍCIO' },
    { href: '/postagens', label: 'POSTAGENS' },
    { href: '/integrantes', label: 'INTEGRANTES' },
    { href: '#contato', label: 'CONTATO' },
  ];

  const handleScrollToFooter = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const footer = document.getElementById('contato');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
    if (isMenuOpen) setIsMenuOpen(false);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 shadow-lg backdrop-blur-sm' : 'bg-background/80'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link href="/" className="flex items-center gap-3 group">
            <GreekColumnIcon />
            <h1 className="text-3xl md:text-4xl font-bold uppercase-ancient text-primary group-hover:text-accent transition-colors duration-300">
              ΣΤΑΣΙΣ
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={link.href === '#contato' ? handleScrollToFooter : () => {}}
                className={`uppercase-ancient text-sm font-medium transition-all duration-200 hover:text-accent hover:scale-105 ${
                  pathname === link.href && link.href !== '#contato' ? 'text-accent scale-110 border-b-2 border-accent' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-accent focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-background shadow-xl z-40 transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
          <nav className="flex flex-col items-center space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={link.href === '#contato' ? handleScrollToFooter : () => setIsMenuOpen(false)}
                className={`uppercase-ancient text-lg font-medium transition-colors hover:text-accent ${
                  pathname === link.href && link.href !== '#contato' ? 'text-accent' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
    </header>
  );
}
