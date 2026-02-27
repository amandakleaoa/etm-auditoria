import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../../../core/api/axiosInstance';

interface CategoriaStats {
    categoriaNome: string;
    cor: string;
    totalTarefas: number;
    concluidas: number;
}

export const DashboardView = () => {
    const [estatisticas, setEstatisticas] = useState<CategoriaStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await api.get('/dashboard/categorias');
                setEstatisticas(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    },[]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Produtividade por Categoria</h2>
            
            <div className="h-[450px] w-full">
                {estatisticas.length > 0? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={estatisticas} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="categoriaNome" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 14}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                            <Tooltip 
                                cursor={{fill: '#F3F4F6'}}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                            <Bar dataKey="totalTarefas" name="Total de Tarefas" fill="#94a3b8" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="concluidas" name="Tarefas Concluídas" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        Nenhum dado analítico disponível no momento.
                    </div>
                )}
            </div>
        </div>
    );
};