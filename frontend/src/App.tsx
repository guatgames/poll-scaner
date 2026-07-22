import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ReviewModal } from './components/ReviewModel';
import { fetchDashboardStats, scanSurveyImage, saveSurveyResult } from './service/api';
import { type QuestionDefinition, type DashboardStats, type ScanResponse, type SurveyAnswers } from './types/types';
import { 
  BarChart2, 
  Upload, 
  FileCheck, 
  Settings, 
  Layers, 
  Users, 
  ShieldCheck, 
  Loader2, 
  X,
  CheckCircle2
} from 'lucide-react';

const QUESTIONS: QuestionDefinition[] = [
  {
    id: 'q1',
    title: '1. ¿Qué factor afecta a que los alumnos no compren en cafetería?',
    options: [
      { key: 'A', text: 'No tengo dinero' },
      { key: 'B', text: 'El tiempo de espera es muy largo' },
      { key: 'C', text: 'Cuento con mi almuerzo' },
    ],
  },
  {
    id: 'q2',
    title: '2. ¿Qué tal son los precios en cafetería?',
    options: [
      { key: 'A', text: 'Altos' },
      { key: 'B', text: 'Medios' },
      { key: 'C', text: 'Buenos' },
      { key: 'D', text: 'Bajos' },
    ],
  },
  {
    id: 'q3',
    title: '3. ¿Con qué frecuencia traes almuerzo a Kinal?',
    options: [
      { key: 'A', text: 'Siempre' },
      { key: 'B', text: 'De vez en cuando' },
      { key: 'C', text: 'Algunas veces' },
      { key: 'D', text: 'Nunca' },
    ],
  },
  {
    id: 'q4',
    title: '4. ¿Recomiendas comprar almuerzo en vez de traerlo?',
    options: [
      { key: 'A', text: 'Sí' },
      { key: 'B', text: 'No' },
      { key: 'C', text: 'Talvez' },
      { key: 'D', text: 'Puede ser' },
    ],
  },
  {
    id: 'q5',
    title: '5. ¿Alguna vez la comida de cafetería te ha caído mal?',
    options: [
      { key: 'A', text: 'Sí' },
      { key: 'B', text: 'No' },
      { key: 'C', text: 'Nunca' },
      { key: 'D', text: 'A veces' },
    ],
  },
];

export const App: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  // Modales y estados de subida
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResponse | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Error al cargar datos del servidor:', err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProcessScan = async () => {
    if (!selectedFile) return;
    setIsScanning(true);
    try {
      const result = await scanSurveyImage(selectedFile);
      setScanResult(result);
      setIsUploadModalOpen(false); // Cierra ventana de subida
      setIsReviewModalOpen(true);  // Abre modal flotante de revisión
    } catch (err) {
      alert('Error al procesar la encuesta OMR. Revisa que FastAPI esté activo.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmSave = async (finalAnswers: SurveyAnswers) => {
    try {
      await saveSurveyResult(finalAnswers);
      setIsReviewModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setScanResult(null);
      setToastMessage('¡Encuesta procesada y guardada correctamente!');
      loadStats(); // Actualiza el Dashboard en vivo
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      alert('Error al guardar los resultados.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b1329] text-slate-100 font-sans">
      
      {/* Sidebar Izquierdo (Estilo Imagen 2) */}
      <aside className="w-64 bg-[#0d1b3e] border-r border-slate-800 flex flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-30">
        <div>
          {/* Logo / Brand Header */}
          <div className="p-6 flex items-center space-x-3 border-b border-slate-800/80">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white leading-none">KINAL Scanner</h1>
              <span className="text-[11px] text-slate-400 font-medium">Cafetería — PE5AV</span>
            </div>
          </div>

          {/* Menú de Navegación Lateral */}
          <nav className="p-4 space-y-1.5 mt-2">
            <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-blue-600/20 text-blue-400 font-bold text-sm border border-blue-500/30">
              <BarChart2 className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium text-sm transition-colors">
              <FileCheck className="w-5 h-5" />
              <span>Encuestas</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium text-sm transition-colors">
              <Layers className="w-5 h-5" />
              <span>Secciones</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium text-sm transition-colors">
              <Settings className="w-5 h-5" />
              <span>Ajustes</span>
            </a>
          </nav>
        </div>

        {/* Perfil del Usuario en el Sidebar (Estilo Imagen 2) */}
        <div className="p-4 m-4 bg-[#132247] rounded-2xl border border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-extrabold border border-blue-400/30">
            <Users className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Kinal Admin</p>
            <p className="text-[10px] text-slate-400 truncate">Investigación 2026</p>
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL (Header + Dashboard + Modales) */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        
        {/* Header Superior con Botón de Escaneo Arriba a la Derecha */}
        <header className="h-20 bg-[#0d1b3e]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Dashboard Analítico</h2>
            <p className="text-xs text-slate-400">Monitoreo en tiempo real de la encuesta de cafetería</p>
          </div>

          {/* BOTÓN PRINCIPAL DE ESCANEO */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Escanear Hoja OMR</span>
          </button>
        </header>

        {/* Notificación Toast de éxito */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/40 text-emerald-200 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">{toastMessage}</span>
          </div>
        )}

        {/* DASHBOARD COMPLETO (SIEMPRE VISIBLE) */}
        <main className="p-8 flex-1">
          <Dashboard stats={stats} questions={QUESTIONS} />
        </main>
      </div>

      {/* MODAL 1: Carga de Archivo (Flotante) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111c38] border border-slate-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            
            <button 
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Subir Encuesta para Escaneo</h3>
            <p className="text-xs text-slate-400 mb-6">Selecciona la imagen escaneada o fotografía de la hoja OMR.</p>

            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-8 bg-[#0d162d] text-center relative cursor-pointer group transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-bold text-white">Haz clic o arrastra la imagen aquí</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG</p>
            </div>

            {selectedFile && (
              <div className="mt-4 p-3 bg-slate-800/60 rounded-xl flex items-center justify-between border border-slate-700">
                <span className="text-xs font-bold text-slate-200 truncate max-w-[200px]">{selectedFile.name}</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-1 rounded-md">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                disabled={!selectedFile || isScanning}
                onClick={handleProcessScan}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center space-x-2"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analizando Marcas...</span>
                  </>
                ) : (
                  <span>Procesar Escaneo</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Formulario de Corrección de Respuestas (Flotante) */}
      {isReviewModalOpen && scanResult && previewUrl && (
        <ReviewModal
          initialAnswers={scanResult.answers}
          confidence={scanResult.confidence}
          imagePreviewUrl={previewUrl}
          questions={QUESTIONS}
          onConfirm={handleConfirmSave}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}

    </div>
  );
};

export default App;