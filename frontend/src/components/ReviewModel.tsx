import React, { useState } from 'react';
import { type SurveyAnswers, type QuestionDefinition } from '../types/types';
import { CheckCircle2, AlertTriangle, Edit3, X } from 'lucide-react';

interface ReviewModalProps {
  initialAnswers: SurveyAnswers;
  confidence: Record<string, number>;
  imagePreviewUrl: string;
  questions: QuestionDefinition[];
  onConfirm: (finalAnswers: SurveyAnswers) => void;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  initialAnswers,
  confidence,
  imagePreviewUrl,
  questions,
  onConfirm,
  onClose,
}) => {
  const [answers, setAnswers] = useState<SurveyAnswers>({ ...initialAnswers });

  const handleOptionChange = (qId: keyof SurveyAnswers, optionKey: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionKey }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#111c38] container max-w-5xl rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-[#0d1b3e] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Revisión Humana OMR</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#091124] p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
            <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase">Documento Original</p>
            <img src={imagePreviewUrl} alt="Escaneo" className="max-h-[420px] object-contain rounded-lg border border-slate-700 shadow-md" />
          </div>

          <div className="space-y-3">
            <div className="bg-blue-950/40 border border-blue-500/30 text-blue-200 p-3 rounded-2xl text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-blue-400" />
              <span>Haz clic sobre cualquier respuesta si deseas corregir la lectura automática del OMR.</span>
            </div>

            {questions.map((q) => {
              const currentVal = answers[q.id];
              const conf = confidence[q.id] || 90;

              return (
                <div key={q.id} className="p-3.5 bg-[#0d1b3e] rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-white truncate max-w-[220px]">{q.title}</p>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {conf}% Confianza
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const isSelected = currentVal === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleOptionChange(q.id, opt.key)}
                          className={`flex items-center justify-between p-2 rounded-xl border text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-500 shadow-md font-bold'
                              : 'bg-[#111c38] text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <span className="truncate">[{opt.key}] {opt.text}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 ml-1 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0d1b3e] border-t border-slate-800 flex justify-end space-x-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800">
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(answers)}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Guardar en Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};