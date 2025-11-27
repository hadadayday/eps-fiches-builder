import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, User, Plus } from 'lucide-react';
import { ForumThread } from '../types';

const MOCK_THREADS: ForumThread[] = [
  {
    id: '1',
    title: 'Quels exercices pour l\'échauffement en Hand ?',
    author: 'Thomas88',
    category: 'Pédagogie',
    replies: 12,
    views: 340,
    lastActive: '2h',
    tags: ['Handball', 'Échauffement'],
  },
  {
    id: '2',
    title: 'Problème de matériel détérioré, que faire ?',
    author: 'Marie_EPS',
    category: 'Matériel & sécurité',
    replies: 5,
    views: 120,
    lastActive: '1j',
    tags: ['Administration', 'Sécurité'],
  },
  {
    id: '3',
    title: 'Notation Cycle Danse 3ème',
    author: 'Lucas_Prof',
    category: 'Évaluation',
    replies: 24,
    views: 890,
    lastActive: '30min',
    tags: ['Danse', 'Collège'],
  },
];

const Forum: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Général');
  const categories = [
    'Général',
    'Pédagogie',
    'Échauffements',
    'Sports collectifs',
    'Sports individuels',
    'Évaluation',
    'Matériel & sécurité',
    'Demandes / Recherche de fiche'
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
             <button className="w-full bg-primary text-white px-4 py-3 rounded-md shadow-sm font-medium hover:bg-sky-600 flex items-center justify-center mb-6">
                <Plus className="h-5 w-5 mr-2" />
                Nouveau Sujet
             </button>
             
             <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                 Catégories
               </div>
               <ul>
                 {categories.map(cat => (
                   <li 
                    key={cat}
                    className={`px-4 py-3 cursor-pointer border-l-4 hover:bg-slate-50 ${activeCategory === cat ? 'border-primary bg-sky-50 text-primary font-medium' : 'border-transparent text-slate-600'}`}
                    onClick={() => setActiveCategory(cat)}
                   >
                     {cat}
                   </li>
                 ))}
               </ul>
             </div>
          </div>

          {/* Main Feed */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">Derniers sujets</h2>
                <p className="text-sm text-slate-500">Discussions dans {activeCategory}</p>
              </div>
            </div>

            <div className="space-y-4">
              {MOCK_THREADS.map(thread => (
                <div key={thread.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                       <div className="flex items-center space-x-2 mb-2">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                           {thread.category}
                         </span>
                         {thread.tags.map(tag => (
                           <span key={tag} className="text-xs text-slate-500">#{tag}</span>
                         ))}
                       </div>
                       <h3 className="text-lg font-semibold text-slate-900 hover:text-primary mb-1">
                         {thread.title}
                       </h3>
                       <div className="flex items-center text-xs text-slate-500 space-x-3">
                         <span className="flex items-center"><User className="w-3 h-3 mr-1" /> Posté par {thread.author}</span>
                         <span>•</span>
                         <span>Il y a {thread.lastActive}</span>
                       </div>
                    </div>
                    <div className="flex items-center space-x-4 text-slate-400">
                       <div className="flex flex-col items-center">
                         <MessageSquare className="w-5 h-5 mb-1" />
                         <span className="text-xs font-medium">{thread.replies}</span>
                       </div>
                       <div className="flex flex-col items-center">
                         <ThumbsUp className="w-5 h-5 mb-1" />
                         <span className="text-xs font-medium">{thread.views}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Forum;