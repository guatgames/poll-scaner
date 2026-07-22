import React from 'react';
import { type DashboardStats, type QuestionDefinition } from '../types/types';
import { Users, Award, CheckCircle2, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  stats: DashboardStats | null;
  questions: QuestionDefinition[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC<DashboardProps> = ({ stats, questions }) => {
  const totalScanned = stats?.total_scanned || 0;

  return (
    <div className="space-y-6">
      
      {/* Fila de Tarjetas KPI Superiores (Inspirado en la Imagen 2) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-[#111c38] p-5 rounded-3xl border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Total Encuestas</p>
            <p className="text-3xl font-black text-white mt-1">{totalScanned}</p>
          </div>
          <div className="p-3.5 bg-blue-600/10 text-blue-400 rounded-2xl border border-blue-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#111c38] p-5 rounded-3xl border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Muestra Objeto</p>
            <p className="text-lg font-bold text-white mt-1">Diversificado</p>
          </div>
          <div className="p-3.5 bg-emerald-600/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#111c38] p-5 rounded-3xl border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Tasa OMR</p>
            <p className="text-3xl font-black text-white mt-1">100%</p>
          </div>
          <div className="p-3.5 bg-amber-600/10 text-amber-400 rounded-2xl border border-amber-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#111c38] p-5 rounded-3xl border border-slate-800 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Estado Sistema</p>
            <p className="text-sm font-bold text-emerald-400 mt-1">● En Línea</p>
          </div>
          <div className="p-3.5 bg-purple-600/10 text-purple-400 rounded-2xl border border-purple-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Gráficas en Cuadrícula Organizada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {questions.map((q) => {
          const qData = stats ? stats[q.id] || {} : {};
          
          const chartData = q.options.map((opt) => {
            const count = qData[opt.key] || 0;
            const percentage = totalScanned > 0 ? ((count / totalScanned) * 100).toFixed(0) : '0';
            return {
              name: `[${opt.key}] ${opt.text}`,
              value: count,
              percentage: `${percentage}%`,
            };
          });

          return (
            <div 
              key={q.id} 
              className="bg-[#111c38] p-5 rounded-3xl border border-slate-800 shadow-md flex flex-col justify-between"
            >
              <h3 className="text-xs font-bold text-slate-200 h-10 line-clamp-2 border-b border-slate-800 pb-2">
                {q.title}
              </h3>

              {/* Contenedor Recharts */}
              <div className="w-full h-56 my-2">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="45%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#111c38" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0d1b3e',
                        borderRadius: '12px',
                        borderColor: '#1e293b',
                        color: '#ffffff',
                        fontSize: '11px',
                      }}
                      formatter={(val: number, name: string, props: any) => [
                        `${val} votos (${props.payload.percentage})`,
                        name,
                      ]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '10px', color: '#94a3b8', paddingTop: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};