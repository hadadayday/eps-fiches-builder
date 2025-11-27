import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">EPS Hub</h3>
          <p className="text-slate-400 text-sm">
            Ressources pédagogiques pour professeurs d’EPS.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li><a href="#" className="hover:text-white">À propos</a></li>
            <li><a href="#" className="hover:text-white">Conditions d'utilisation</a></li>
            <li><a href="#" className="hover:text-white">Politique de confidentialité</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-slate-400 text-sm mb-2">Recevez les meilleures fiches chaque semaine.</p>
          <div className="flex">
            <input type="email" placeholder="Votre email" className="px-3 py-2 text-slate-900 rounded-l-md w-full focus:outline-none" />
            <button className="bg-primary px-4 py-2 rounded-r-md hover:bg-sky-600 transition">OK</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        &copy; 2025 EPS Hub — Tous droits réservés
      </div>
    </footer>
  );
};

export default Footer;