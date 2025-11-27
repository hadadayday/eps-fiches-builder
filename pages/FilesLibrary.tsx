import React, { useState, useRef, useEffect } from 'react';
import { Search, Download, Star, Eye, Upload, X, CheckCircle, File as FileIcon, Trash2, Loader2, Plus, FileText } from 'lucide-react';
import { GradeLevel, SportType, Worksheet } from '../types';

const MOCK_WORKSHEETS: Worksheet[] = [
  {
    id: '1',
    title: 'Situation de 1 contre 1 avec appui',
    author: 'Marc D.',
    sport: SportType.BASKETBALL,
    grade: GradeLevel.COLLEGE_3,
    type: 'PDF',
    downloads: 120,
    rating: 4.5,
    thumbnailUrl: 'https://picsum.photos/seed/bball/400/300',
    date: '2023-10-15',
    aiGenerated: false,
  },
  {
    id: '2',
    title: 'Cycle complet Acrosport - Sécurité',
    author: 'Sarah L.',
    sport: SportType.GYMNASTICS,
    grade: GradeLevel.LYCEE_1,
    type: 'DOCX',
    downloads: 85,
    rating: 4.8,
    thumbnailUrl: 'https://picsum.photos/seed/gym/400/300',
    date: '2023-11-02',
    aiGenerated: true,
  },
  {
    id: '3',
    title: 'Fiche d\'observation Badminton',
    author: 'Julien P.',
    sport: SportType.BADMINTON,
    grade: GradeLevel.LYCEE_TC,
    type: 'PDF',
    downloads: 340,
    rating: 4.9,
    thumbnailUrl: 'https://picsum.photos/seed/bad/400/300',
    date: '2023-09-10',
    aiGenerated: false,
  },
  {
    id: '4',
    title: 'Parcours Athlétisme Relais Vitesse',
    author: 'Équipe EPS',
    sport: SportType.ATHLETICS,
    grade: GradeLevel.COLLEGE_1,
    type: 'IMG',
    downloads: 45,
    rating: 4.0,
    thumbnailUrl: 'https://picsum.photos/seed/ath/400/300',
    date: '2023-12-05',
    aiGenerated: false,
  },
  {
    id: '5',
    title: 'Tournoi Rugby Touché',
    author: 'Thomas R.',
    sport: SportType.RUGBY,
    grade: GradeLevel.LYCEE_2,
    type: 'PDF',
    downloads: 210,
    rating: 4.7,
    thumbnailUrl: 'https://picsum.photos/seed/rugby/400/300',
    date: '2024-01-20',
    aiGenerated: true,
  },
];

interface UploadItem {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
}

const FilesLibrary: React.FC = () => {
  const [files, setFiles] = useState<Worksheet[]>(MOCK_WORKSHEETS);
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = files.filter(file => {
    const matchSport = selectedSport === 'All' || file.sport === selectedSport;
    const matchGrade = selectedGrade === 'All' || file.grade === selectedGrade;
    const matchSearch = file.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        file.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSport && matchGrade && matchSearch;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newItems: UploadItem[] = Array.from(e.target.files).map((file: File) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: 'pending'
      }));
      setUploadQueue(prev => [...prev, ...newItems]);
    }
    // Reset input so same files can be selected again if needed (though unlikely for immediate re-select)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFileFromQueue = (id: string) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  };

  const startUpload = () => {
    setIsUploading(true);
    
    // Filter items that need uploading
    const itemsToUpload = uploadQueue.filter(item => item.status === 'pending' || item.status === 'error');
    
    if (itemsToUpload.length === 0) {
        setIsUploading(false);
        return;
    }

    // Set status to uploading
    setUploadQueue(prev => prev.map(item => 
      (item.status === 'pending' || item.status === 'error') ? { ...item, status: 'uploading' } : item
    ));

    // Simulate upload for each file
    itemsToUpload.forEach(item => {
      // Simulate variable network speed
      const speed = Math.random() * 15 + 5; 
      let currentProgress = 0;

      const interval = setInterval(() => {
        currentProgress += speed;
        
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          
          // Update queue status to success
          setUploadQueue(prev => prev.map(qItem => 
            qItem.id === item.id ? { ...qItem, progress: 100, status: 'success' } : qItem
          ));

          // Add to main library list
          const newFile: Worksheet = {
            id: item.id,
            title: item.file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            author: 'Vous',
            sport: SportType.OTHER, // Default for upload
            grade: GradeLevel.COLLEGE_1, // Default for upload
            type: item.file.name.toLowerCase().endsWith('pdf') ? 'PDF' : 
                  item.file.name.toLowerCase().includes('doc') ? 'DOCX' : 'IMG',
            downloads: 0,
            rating: 0,
            thumbnailUrl: 'https://picsum.photos/seed/newdoc/400/300',
            date: new Date().toISOString(),
            aiGenerated: false,
          };
          
          setFiles(prev => [newFile, ...prev]);
        } else {
          // Update progress
          setUploadQueue(prev => prev.map(qItem => 
            qItem.id === item.id ? { ...qItem, progress: currentProgress } : qItem
          ));
        }
      }, 400);
    });
  };

  // Check if all active uploads are done to stop the "uploading" state
  useEffect(() => {
    if (isUploading) {
        const allDone = uploadQueue.every(item => item.status === 'success' || item.status === 'error');
        if (allDone && uploadQueue.length > 0) {
            setIsUploading(false);
        }
    }
  }, [uploadQueue, isUploading]);

  const successfulUploads = uploadQueue.filter(i => i.status === 'success').length;
  const totalFiles = uploadQueue.length;

  const closeModal = () => {
    setIsUploadModalOpen(false);
    setUploadQueue([]);
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
             <h1 className="text-2xl font-bold text-slate-900">EPS Fichiers — Bibliothèque de Documents</h1>
             <p className="text-slate-500 text-sm mt-1">Une bibliothèque complète pour l’EPS</p>
          </div>
          <div className="mt-4 md:mt-0">
             <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
             >
                <Upload className="h-4 w-4 mr-2" />
                Importer des fichiers
             </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
              <input
                type="text"
                placeholder="Recherche..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="flex-1">
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="All">Sport</option>
                {Object.values(SportType).map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>
             <div className="flex-1">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
              >
                <option value="All">Niveau / Classe</option>
                {Object.values(GradeLevel).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            <div>
                <button 
                    onClick={() => {setSelectedSport('All'); setSelectedGrade('All'); setSearchQuery('');}}
                    className="w-full md:w-auto px-4 py-2 text-sm text-slate-600 hover:text-slate-900 bg-slate-100 rounded-md"
                >
                    Réinitialiser
                </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <div key={file.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
              <div className="relative h-40 bg-slate-200">
                <img src={file.thumbnailUrl} alt={file.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">
                  {file.type}
                </div>
                 {file.aiGenerated && (
                   <div className="absolute top-2 left-2 bg-accent/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white shadow-sm flex items-center">
                     <Star className="w-3 h-3 mr-1 fill-current" /> AI
                   </div>
                 )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-primary bg-sky-50 px-2 py-1 rounded-full">
                    {file.sport}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2 flex-1">
                  {file.title}
                </h3>
                <div className="text-xs text-slate-500 mb-3 space-y-1">
                     <p>Par {file.author}</p>
                     <p>Niveau : {file.grade}</p>
                     <p>Publié le : {new Date(file.date).toLocaleDateString('fr-FR')}</p>
                </div>
                
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button className="flex-1 flex items-center justify-center px-3 py-1.5 text-xs font-medium text-white bg-primary rounded hover:bg-sky-600 transition">
                        <Download className="w-3 h-3 mr-1" />
                        Télécharger
                    </button>
                    <button className="flex items-center justify-center p-1.5 text-slate-500 bg-slate-50 rounded hover:bg-slate-100 transition" title="Aperçu">
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredFiles.length === 0 && (
          <div className="text-center py-20">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Aucun résultat</h3>
            <p className="text-slate-500">Essayez de modifier vos filtres de recherche.</p>
          </div>
        )}

      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => !isUploading && closeModal()}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
             {/* Modal Header */}
             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                   <Upload className="w-5 h-5 mr-2 text-primary" /> 
                   Importer des documents
                </h3>
                {!isUploading && (
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition">
                        <X className="w-5 h-5" />
                    </button>
                )}
             </div>

             {/* Modal Body */}
             <div className="p-6 flex-1 overflow-y-auto">
                
                {/* Upload Area */}
                {!isUploading && successfulUploads !== uploadQueue.length && (
                    <div 
                        className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition cursor-pointer mb-6"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            multiple 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                        <div className="bg-sky-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                            <Plus className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-slate-900">Cliquez pour sélectionner des fichiers</p>
                        <p className="text-xs text-slate-500 mt-1">PDF, DOCX, JPG, PNG (Max 20MB)</p>
                    </div>
                )}

                {/* File List Queue */}
                {uploadQueue.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex justify-between items-end mb-2">
                            <h4 className="text-sm font-semibold text-slate-700">Fichiers ({uploadQueue.length})</h4>
                            {successfulUploads > 0 && (
                                <span className="text-xs font-medium text-green-600">{successfulUploads}/{uploadQueue.length} terminés</span>
                            )}
                        </div>
                        {uploadQueue.map((item) => (
                            <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-3">
                                <div className="h-10 w-10 bg-white rounded border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                    <FileIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between mb-1">
                                        <p className="text-sm font-medium text-slate-900 truncate pr-2">{item.file.name}</p>
                                        <span className="text-xs text-slate-500">{item.progress > 0 ? `${Math.round(item.progress)}%` : ''}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className={`h-1.5 rounded-full transition-all duration-300 ${item.status === 'success' ? 'bg-green-500' : 'bg-primary'}`}
                                            style={{ width: `${item.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    {item.status === 'pending' && !isUploading && (
                                        <button onClick={() => removeFileFromQueue(item.id)} className="text-slate-400 hover:text-red-500 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    {item.status === 'uploading' && (
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    )}
                                    {item.status === 'success' && (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {uploadQueue.length === 0 && (
                    <div className="text-center text-slate-400 py-4 text-sm">
                        Aucun fichier sélectionné.
                    </div>
                )}
             </div>

             {/* Modal Footer */}
             <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                {successfulUploads === uploadQueue.length && uploadQueue.length > 0 ? (
                     <button 
                        onClick={closeModal}
                        className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition shadow-sm flex items-center"
                     >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Terminer
                     </button>
                ) : (
                    <>
                        <button 
                            onClick={closeModal}
                            disabled={isUploading}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button 
                            onClick={startUpload}
                            disabled={uploadQueue.length === 0 || isUploading}
                            className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-sky-600 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isUploading ? 'Envoi en cours...' : "Démarrer l'import"}
                        </button>
                    </>
                )}
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FilesLibrary;