import React, { useState } from 'react';
import { Menu, X, User, Search } from 'lucide-react';

interface NavbarProps {
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ setCurrentPage, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Accueil', id: 'home' },
    { name: 'Forum', id: 'forum' },
    { name: 'EPS Fichiers', id: 'files' },
    { name: 'EPS Fiche', id: 'editor' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">EPS Hub</span>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setCurrentPage(link.id)}
                  className={`${
                    currentPage === link.id
                      ? 'border-primary text-slate-900'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors duration-200`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-1.5 border border-slate-200 rounded-full leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Rechercher..."
                />
              </div>
            <button className="p-2 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none" title="Mon Compte">
              <User className="h-6 w-6" />
            </button>
            <button className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Connexion
            </button>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              <span className="sr-only">Ouvrir menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentPage(link.id);
                setIsOpen(false);
              }}
              className={`${
                currentPage === link.id
                  ? 'bg-sky-50 border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
            >
              {link.name}
            </button>
          ))}
        </div>
        <div className="pt-4 pb-4 border-t border-slate-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="h-6 w-6 text-slate-400" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-slate-800">Invité</div>
              <div className="text-sm font-medium text-slate-500">prof@exemple.com</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;