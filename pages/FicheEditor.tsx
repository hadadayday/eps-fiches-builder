import React, { useState } from 'react';
import { Save, FileText, Wand2, Loader2, Download, ChevronDown, ChevronUp, Plus, Image as ImageIcon, Edit2, Trash2, FileType } from 'lucide-react';
import { generateFicheContent } from '../services/geminiService';
import { FicheData, SportType, GradeLevel, FicheActivity } from '../types';
import { generateDocx } from '../utils/docxGenerator';

const FicheEditor: React.FC = () => {
  const [mode, setMode] = useState<'manual' | 'ai'>('ai');
  const [loading, setLoading] = useState(false);
  
  // AI State
  const [generatedData, setGeneratedData] = useState<FicheData | null>(null);

  // Manual State
  const [manualData, setManualData] = useState<FicheData>({
    title: 'Nouvelle Séance',
    subject: 'EPS',
    grade: GradeLevel.COLLEGE_1,
    sport: SportType.BASKETBALL,
    durationTotal: '55 min',
    competences: ['Compétence visée (APC)'],
    objectives: ['Objectif opérationnel'],
    activities: [
      { name: 'Échauffement', duration: '10 min', description: 'Description...', organization: 'Dispositif', difficulty: 'Facile' }
    ],
    materials: ['Plots'],
    safety: ['Consigne de sécurité'],
    evaluation: ['Critère 1'],
    indicators: ['Indicateur observable'],
    differentiation: '',
    notes: ''
  });

  // Form State for AI
  const [topic, setTopic] = useState('');
  const [sport, setSport] = useState(SportType.BASKETBALL);
  const [grade, setGrade] = useState(GradeLevel.COLLEGE_2);
  const [duration, setDuration] = useState(55);
  const [activityType, setActivityType] = useState('Apprentissage');
  const [constraints, setConstraints] = useState('');
  const [extraInstructions, setExtraInstructions] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    const data = await generateFicheContent(sport, grade, duration, topic, activityType, constraints, extraInstructions);
    if (data) {
        setGeneratedData(data);
    }
    setLoading(false);
  };

  // Actions
  const handleTransferToManual = () => {
    if (generatedData) {
        // Deep copy to ensure independent editing
        const dataToTransfer: FicheData = {
            ...generatedData,
            competences: [...(generatedData.competences || [])],
            objectives: [...(generatedData.objectives || [])],
            materials: [...(generatedData.materials || [])],
            safety: [...(generatedData.safety || [])],
            evaluation: [...(generatedData.evaluation || [])],
            indicators: [...(generatedData.indicators || [])],
            activities: generatedData.activities.map(act => ({ ...act }))
        };

        setManualData(dataToTransfer);
        setMode('manual');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSave = () => {
    alert("Fiche enregistrée avec succès dans 'Mes Fiches' !");
  };

  const handleExportDocx = () => {
    const dataToExport = mode === 'manual' ? manualData : generatedData;
    if (dataToExport) {
        generateDocx(dataToExport);
    } else {
        alert("Aucune donnée à exporter.");
    }
  };

  // Manual Editor Helpers
  const updateManualField = (field: keyof FicheData, value: any) => {
    setManualData(prev => ({ ...prev, [field]: value }));
  };

  const updateManualArray = (field: keyof FicheData, value: string) => {
      setManualData(prev => ({ ...prev, [field]: value.split('\n') }));
  };

  const updateManualActivity = (index: number, field: keyof FicheActivity, value: string) => {
    const newActs = [...manualData.activities];
    newActs[index] = { ...newActs[index], [field]: value };
    setManualData(prev => ({ ...prev, activities: newActs }));
  };

  const addManualActivity = () => {
    setManualData(prev => ({
        ...prev,
        activities: [...prev.activities, { name: 'Nouvelle activité', duration: '10 min', description: '', difficulty: 'Moyen' }]
    }));
  };

  const removeManualActivity = (index: number) => {
    setManualData(prev => ({
        ...prev,
        activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  // Determine which data to render in preview
  const dataToRender = mode === 'ai' ? generatedData : manualData;
  const showPreview = (mode === 'ai' && generatedData) || mode === 'manual';

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-900">EPS Fiche (Maroc)</h1>
          <div className="flex space-x-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            <button
              onClick={() => setMode('manual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${mode === 'manual' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Construire ma Fiche
            </button>
            <button
              onClick={() => setMode('ai')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${mode === 'ai' ? 'bg-accent/10 text-accent shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Wand2 className="w-4 h-4 inline mr-2" />
              AI Fiche
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls / Form Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-h-[calc(100vh-200px)] overflow-y-auto">
              {mode === 'ai' ? (
                <>
                   <div className="flex items-center mb-4 pb-2 border-b border-slate-100">
                      <Wand2 className="w-5 h-5 text-accent mr-2" />
                      <h3 className="text-lg font-semibold text-slate-800">Générateur de Fiche IA</h3>
                   </div>
                   <p className="text-xs text-slate-500 mb-4 bg-yellow-50 p-2 rounded border border-yellow-100">
                     Conforme aux Orientations Pédagogiques 2007/2009 (APC).
                   </p>
                   
                   <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sport</label>
                      <select
                        value={sport}
                        onChange={(e) => setSport(e.target.value as SportType)}
                        className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border"
                      >
                        {Object.values(SportType).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Niveau (Maroc)</label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value as GradeLevel)}
                        className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border"
                      >
                        {Object.values(GradeLevel).map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Durée (min)</label>
                          <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border"
                          />
                        </div>
                         <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Type d’activité</label>
                           <select
                            value={activityType}
                            onChange={(e) => setActivityType(e.target.value)}
                            className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border"
                          >
                            <option value="Échauffement">Échauffement</option>
                            <option value="Apprentissage">Apprentissage</option>
                            <option value="Évaluation">Évaluation</option>
                            <option value="Situation Problème">Situation Problème</option>
                          </select>
                        </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Thème / Objectif</label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Ex: Passe et va"
                        className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border"
                      />
                    </div>
                    
                     <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Instructions supplémentaires</label>
                      <textarea
                        value={extraInstructions}
                        onChange={(e) => setExtraInstructions(e.target.value)}
                        placeholder="Ex: Insister sur la différenciation..."
                        className="w-full border-slate-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2 border h-20 resize-none"
                      />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-orange-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition mt-4"
                    >
                        {loading ? (
                           <>
                             <Loader2 className="w-4 h-4 animate-spin mr-2" /> Génération en cours…
                           </>
                        ) : (
                           <>
                             <Wand2 className="w-4 h-4 mr-2" /> Générer (APC)
                           </>
                        )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                   <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Propriétés de la Fiche</h3>
                   
                   {/* Manual Editor Inputs */}
                   <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Titre</label>
                        <input 
                            type="text" 
                            value={manualData.title}
                            onChange={(e) => updateManualField('title', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded bg-slate-50 text-sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Sport</label>
                            <select
                                value={manualData.sport}
                                onChange={(e) => updateManualField('sport', e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded bg-slate-50 text-sm"
                            >
                                {Object.values(SportType).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Niveau</label>
                            <select
                                value={manualData.grade}
                                onChange={(e) => updateManualField('grade', e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded bg-slate-50 text-sm"
                            >
                                {Object.values(GradeLevel).map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                          </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-accent mb-1 uppercase">Compétences (APC)</label>
                        <textarea 
                            value={manualData.competences?.join('\n')}
                            onChange={(e) => updateManualArray('competences', e.target.value)}
                            className="w-full p-2 border border-orange-200 rounded bg-orange-50 text-sm h-16"
                            placeholder="Une par ligne"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Objectifs Pédagogiques</label>
                        <textarea 
                            value={manualData.objectives?.join('\n')}
                            onChange={(e) => updateManualArray('objectives', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded bg-slate-50 text-sm h-16"
                            placeholder="Une par ligne"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Matériel</label>
                            <textarea
                                value={manualData.materials?.join('\n')}
                                onChange={(e) => updateManualArray('materials', e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded bg-slate-50 text-sm h-16"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-red-500 mb-1 uppercase">Sécurité</label>
                            <textarea
                                value={manualData.safety?.join('\n')}
                                onChange={(e) => updateManualArray('safety', e.target.value)}
                                className="w-full p-2 border border-red-200 rounded bg-red-50 text-sm h-16"
                            />
                          </div>
                      </div>
                   </div>

                   {/* Activities List for Manual Edit */}
                   <div className="pt-4 border-t border-slate-100">
                       <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Activités</label>
                       <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                           {manualData.activities?.map((act, idx) => (
                               <div key={idx} className="bg-slate-50 border border-slate-200 p-2 rounded text-sm relative group">
                                    <div className="flex gap-2 mb-2">
                                        <input 
                                            value={act.name}
                                            onChange={(e) => updateManualActivity(idx, 'name', e.target.value)}
                                            className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs font-semibold"
                                            placeholder="Titre"
                                        />
                                        <input 
                                            value={act.duration}
                                            onChange={(e) => updateManualActivity(idx, 'duration', e.target.value)}
                                            className="w-14 px-2 py-1 border border-slate-200 rounded text-xs text-center"
                                            placeholder="10'"
                                        />
                                    </div>
                                    <textarea 
                                        value={act.description}
                                        onChange={(e) => updateManualActivity(idx, 'description', e.target.value)}
                                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs resize-none h-12 mb-1"
                                        placeholder="Description..."
                                    />
                                    <input 
                                        value={act.organization || ''}
                                        onChange={(e) => updateManualActivity(idx, 'organization', e.target.value)}
                                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs mb-1"
                                        placeholder="Organisation"
                                    />
                                    <button 
                                        onClick={() => removeManualActivity(idx)}
                                        className="absolute top-1 right-1 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                               </div>
                           ))}
                       </div>
                       <button 
                            onClick={addManualActivity}
                            className="mt-3 w-full flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                       >
                          <Plus className="w-4 h-4 mr-2"/> Ajouter un bloc
                       </button>
                   </div>
                   
                   <div className="pt-4 border-t border-slate-100 space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Évaluation (Critères)</label>
                            <textarea 
                                value={manualData.evaluation?.join('\n')}
                                onChange={(e) => updateManualArray('evaluation', e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded bg-slate-50 text-sm h-12"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Différenciation</label>
                            <textarea 
                                value={manualData.differentiation}
                                onChange={(e) => updateManualField('differentiation', e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded bg-slate-50 text-sm h-12"
                            />
                        </div>
                   </div>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                {generatedData && mode === 'ai' && (
                     <div className="flex items-center text-green-600 mb-3 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Votre fiche est prête !
                     </div>
                )}
                <div className="space-y-2">
                    {mode === 'ai' && generatedData && (
                        <button 
                            onClick={handleTransferToManual}
                            className="w-full flex items-center justify-center text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-md transition"
                        >
                            <Edit2 className="w-4 h-4 mr-2"/>
                            Insérer dans l’éditeur
                        </button>
                    )}
                    
                    <button 
                        onClick={handleSave}
                        className="w-full flex items-center justify-center text-white bg-primary hover:bg-sky-600 px-4 py-2 rounded-md transition"
                    >
                        <Save className="w-4 h-4 mr-2"/>
                        Enregistrer
                    </button>
                    
                    <button 
                        onClick={handleExportDocx}
                        className="w-full flex items-center justify-center text-slate-700 border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-md transition"
                    >
                        <FileType className="w-4 h-4 mr-2 text-blue-700"/>
                        Exporter en Word (.docx)
                    </button>
                </div>
            </div>
          </div>

          {/* Preview / Editor Area */}
          <div className="lg:col-span-8">
            <div className="bg-white min-h-[800px] shadow-lg border border-slate-200 rounded-lg p-8 relative print:shadow-none print:border-0">
              {!showPreview ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    {loading ? (
                        <>
                            <Loader2 className="w-12 h-12 animate-spin text-accent mb-4" />
                            <p className="text-lg font-medium text-slate-600">Génération APC en cours...</p>
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-16 h-16 mb-4 opacity-20" />
                            <p>Remplissez le formulaire pour générer une fiche conforme aux OP.</p>
                        </>
                    )}
                </div>
              ) : (
                <div className="animate-fadeIn font-sans text-slate-900">
                    {/* Header */}
                    <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold uppercase tracking-tight">{dataToRender?.title || "Titre de la fiche"}</h2>
                            <div className="flex items-center mt-2 text-slate-600 font-medium space-x-4 text-sm">
                                <span className="bg-slate-100 px-2 py-1 rounded uppercase tracking-wide">Niveau : {dataToRender?.grade}</span>
                                <span>Sport : {dataToRender?.sport}</span>
                                <span>Durée : {dataToRender?.durationTotal}</span>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                             <div className="text-xl font-bold text-slate-300">Maroc</div>
                             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">OP 2007/2009</div>
                        </div>
                    </div>

                    {/* Compétences (APC) */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">Compétence(s) visée(s)</h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-800">
                            {dataToRender?.competences?.map((c, idx) => (
                                <li key={idx} className="leading-relaxed">{c}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Objectives */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-primary mb-2 border-b border-sky-100 pb-1">Objectifs pédagogiques</h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-800">
                            {dataToRender?.objectives?.map((obj, idx) => (
                                <li key={idx} className="leading-relaxed">{obj}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Matériel & Sécurité Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-50 p-4 rounded border border-slate-100">
                             <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">Matériel</h4>
                             <ul className="text-sm list-disc list-inside text-slate-600">
                                {dataToRender?.materials?.map((m, i) => <li key={i}>{m}</li>)}
                             </ul>
                        </div>
                        <div className="bg-red-50 p-4 rounded border border-red-100">
                             <h4 className="font-bold text-red-700 mb-2 text-sm uppercase">Sécurité</h4>
                             <ul className="text-sm list-disc list-inside text-slate-700">
                                {dataToRender?.safety?.map((s, i) => <li key={i}>{s}</li>)}
                             </ul>
                        </div>
                    </div>

                    {/* Activities */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-primary mb-4 border-b border-sky-100 pb-1">Déroulement</h3>
                        <div className="space-y-6">
                            {dataToRender?.activities?.map((act, idx) => (
                                <div key={idx} className="relative pl-6 border-l-2 border-slate-300">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                                        <h4 className="text-lg font-bold text-slate-900">Activité {idx+1} : {act.name || "Sans titre"}</h4>
                                        <div className="text-sm font-medium text-slate-500 mt-1 sm:mt-0">
                                            {act.duration} • Diff: {act.difficulty}
                                        </div>
                                    </div>
                                    <div className="prose prose-sm text-slate-700 max-w-none mb-3">
                                        {act.description || "Aucune description..."}
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded text-xs text-slate-600 border border-slate-100">
                                        <span className="font-bold">Organisation :</span> {act.organization || "Voir description"}
                                    </div>
                                    {act.variations && (
                                        <div className="mt-2 text-xs text-slate-500 italic">
                                            <span className="font-bold">Variantes :</span> {act.variations}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Infos: Evaluation & Différenciation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-6">
                        <div>
                            <h4 className="font-bold text-slate-900 mb-2 text-sm uppercase">Évaluation (Critères & Indicateurs)</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Critères</p>
                                    <ul className="text-sm list-disc list-inside">{dataToRender?.evaluation?.map((e,i)=><li key={i}>{e}</li>)}</ul>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Indicateurs</p>
                                    <ul className="text-sm list-disc list-inside">{dataToRender?.indicators?.map((ind,i)=><li key={i}>{ind}</li>)}</ul>
                                </div>
                            </div>
                        </div>
                        <div>
                             <h4 className="font-bold text-slate-900 mb-2 text-sm uppercase">Différenciation & Notes</h4>
                             <div className="bg-orange-50 p-3 rounded border border-orange-100 text-sm text-slate-700 mb-2">
                                {dataToRender?.differentiation || "Aucune différenciation spécifiée."}
                             </div>
                             <p className="text-sm text-slate-600 italic">
                                Note : {dataToRender?.notes}
                             </p>
                        </div>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FicheEditor;