import React, { useState } from 'react';
import { Upload, FileImage, Loader2, CheckCircle } from 'lucide-react';
import { scanSurveyImage, saveSurveyResult } from '../service/api';
import { type ScanResponse, type SurveyAnswers, type QuestionDefinition } from '../types/types';
import { ReviewModal } from './ReviewModel';

interface ScannerModuleProps {
  questions: QuestionDefinition[];
  onSuccessSave: () => void;
}

export const ScannerModule: React.FC<ScannerModuleProps> = ({ questions, onSuccessSave }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanResult(null);
    }
  };

  const handleProcessImage = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const result = await scanSurveyImage(selectedFile);
      setScanResult(result);
      setIsModalOpen(true);
    } catch (err) {
      alert('Error al conectar con el servidor Python. Verifica que FastAPI esté iniciado.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReview = async (finalAnswers: SurveyAnswers) => {
    try {
      await saveSurveyResult(finalAnswers);
      setIsModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setToastMessage('¡Encuesta procesada y guardada correctamente!');
      onSuccessSave();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      alert('Error al guardar los resultados.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {toastMessage && (
        <div className="bg-tertiaryContainer text-onTertiaryContainer border border-tertiary/30 p-4 rounded-2xl shadow-lg flex items-center space-x-3 transition-all">
          <CheckCircle className="w-5 h-5 text-tertiary flex-shrink-0" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="bg-surfaceContainerLow p-8 sm:p-10 rounded-3xl border border-outlineVariant/50 shadow-md text-center">
        <h2 className="text-2xl font-bold text-onSurface mb-2">Escanear Hoja de Encuesta</h2>
        <p className="text-sm text-outline max-w-lg mx-auto mb-8 leading-relaxed">
          Sube la fotografía de la encuesta de cafetería. El algoritmo detecta marcas con resaltador azul, lapicero o lápiz.
        </p>

        {/* Upload Dropzone */}
        <div className="border-2 border-dashed border-outlineVariant hover:border-primary/80 rounded-3xl p-10 bg-surfaceContainerHigh/30 transition-all flex flex-col items-center justify-center cursor-pointer relative group">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="p-4 bg-primary/10 text-primary rounded-2xl mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <p className="text-base font-bold text-onSurface">Haz clic o arrastra la imagen de la encuesta</p>
          <p className="text-xs text-outline mt-1 font-medium">Formatos soportados: PNG, JPG, JPEG</p>
        </div>

        {/* Selected File Bar */}
        {selectedFile && previewUrl && (
          <div className="mt-6 p-4 bg-surfaceContainerHigh rounded-2xl flex items-center justify-between border border-outlineVariant/60">
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 bg-primaryContainer text-onPrimaryContainer rounded-xl">
                <FileImage className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-onSurface truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-xs text-outline font-medium">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>

            <button
              onClick={handleProcessImage}
              disabled={loading}
              className="px-6 py-3 rounded-full bg-primary text-onPrimary font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando Visión OMR...</span>
                </>
              ) : (
                <span>Escanear Hoja</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modal Human-in-the-Loop */}
      {isModalOpen && scanResult && previewUrl && (
        <ReviewModal
          initialAnswers={scanResult.answers}
          confidence={scanResult.confidence}
          imagePreviewUrl={previewUrl}
          questions={questions}
          onConfirm={handleConfirmReview}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};