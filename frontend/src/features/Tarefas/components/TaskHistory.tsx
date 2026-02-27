import { useEffect, useState } from 'react';
import { api } from '../../../core/api/axiosInstance';

interface HistoricoItem {
    id: number;
    alteracao: string;
    timestamp: string;
}

export const TaskHistory = ({ tarefaId, onClose }: { tarefaId: number, onClose: () => void }) => {
    const [historico, setHistorico] = useState<HistoricoItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    api.get<HistoricoItem[]>(`/historico/tarefa/${tarefaId}`)
      .then(res => setHistorico(res.data))
      .catch(() => setHistorico([]))
      .finally(() => setLoading(false));
}, [tarefaId]);

    return (
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 relative max-h-[80vh] overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">✖</button>
            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Histórico de Alterações</h3>
            
            {loading? (
                <div className="flex justify-center p-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div></div>
            ) : historico.length === 0? (
                <p className="text-gray-500 text-center py-4">Nenhum registro encontrado para esta tarefa.</p>
            ) : (
                <ol className="relative border-l border-indigo-200 ml-3">                  
                    {historico.map((item) => (
                        <li key={item.id} className="mb-6 ml-6">
                            <span className="absolute flex items-center justify-center w-3 h-3 bg-indigo-600 rounded-full -left-1.5 ring-4 ring-white"></span>
                            <time className="mb-1 text-xs font-normal leading-none text-gray-400">
                                {new Date(item.timestamp).toLocaleString()}
                            </time>
                            <p className="text-sm font-medium text-gray-700 mt-1">
                                {JSON.stringify(item.alteracao).replace(/[{""}]/g, '')}
                            </p>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};