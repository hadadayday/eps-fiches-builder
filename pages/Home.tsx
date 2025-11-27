import React from 'react';
import { FileText, Users, Zap } from 'lucide-react';

interface HomeProps {
  setCurrentPage: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ setCurrentPage }) => {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">EPS Hub — Ressources & Fiches EPS</span>{' '}
                  <span className="block text-primary xl:inline">pour Collège et Lycée</span>
                </h1>
                <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Téléchargez, partagez et créez vos fiches pédagogiques en quelques clics.
                  Générez des fiches complètes grâce à l’IA et rejoignez une communauté active de profs d’EPS.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => setCurrentPage('files')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-sky-600 md:py-4 md:text-lg transition"
                    >
                      Parcourir les Fichiers
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => setCurrentPage('editor')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-sky-100 hover:bg-sky-200 md:py-4 md:text-lg transition"
                    >
                      Créer une Fiche
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://picsum.photos/seed/sports/1200/800"
            alt="Étudiants faisant du sport"
          />
          <div className="absolute inset-0 bg-primary mix-blend-multiply opacity-20 lg:hidden"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Fonctionnalités</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Tout pour réussir vos cours
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <dt className="text-lg leading-6 font-medium text-slate-900">Une bibliothèque complète pour l’EPS</dt>
                <dd className="mt-2 text-base text-slate-500">
                  Accédez à des centaines de fiches et documents classés par niveaux, sports et objectifs.
                </dd>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent text-white mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <dt className="text-lg leading-6 font-medium text-slate-900">Créez vos fiches facilement</dt>
                <dd className="mt-2 text-base text-slate-500">
                  Utilisez notre éditeur intuitif pour construire vos propres fiches ou laissez l’IA en proposer une version clé en main.
                </dd>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary text-white mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <dt className="text-lg leading-6 font-medium text-slate-900">Une communauté engagée</dt>
                <dd className="mt-2 text-base text-slate-500">
                  Posez vos questions, partagez vos idées et échangez autour des meilleures pratiques pédagogiques.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Stats */}
      <section className="bg-slate-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Rejoignez la communauté EPS Hub
            </h2>
            <p className="mt-3 text-xl text-slate-400 sm:mt-4">
              La référence pour les enseignants d'EPS modernes.
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-slate-400">Fiches disponibles</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">2k+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-slate-400">Professeurs inscrits</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">500+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-slate-400">Sports couverts</dt>
              <dd className="order-1 text-5xl font-extrabold text-white">30+</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
};

export default Home;