import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FilesLibrary from './pages/FilesLibrary';
import Forum from './pages/Forum';
import FicheEditor from './pages/FicheEditor';

const App: React.FC = () => {
  // Simple client-side routing for the demo without React Router dependency if preferred,
  // but instructions allow HashRouter. However, using state is cleaner for a single-file structure demo.
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'files':
        return <FilesLibrary />;
      case 'forum':
        return <Forum />;
      case 'editor':
        return <FicheEditor />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
