import { useEffect, useState } from 'react';
import { useTaskStore } from '../hooks/useTaskStore';
import { TaskCard } from '../components/TaskCard';
import { TarefaForm } from '../components/TarefaForm';
import { CategoriasManager } from '../../Categorias/CategoriasManager';
import { TaskHistory } from '../components/TaskHistory';
import { TagsManager } from '../components/TagsManager'; // Importação do novo form
import type { Tarefa } from '../types';

export const TarefasView = () => {
  const { tarefas, loading, fetchTarefas, fetchCategorias, fetchTags } = useTaskStore();
  
  const [modalOpen, setModalOpen] = useState<'TAREFA' | 'CATEGORIA' | 'HISTORICO' | 'TAG' | null>(null);
  const [tarefaSelecionadaId, setTarefaSelecionadaId] = useState<number | null>(null);
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null);

  useEffect(() => {
    fetchTarefas();
    fetchCategorias();
    fetchTags();
  }, []);

  const abrirHistorico = (id: number) => {
    setTarefaSelecionadaId(id);
    setModalOpen('HISTORICO');
  };

  const abrirEdicao = (tarefa: Tarefa) => {
    setTarefaEditando(tarefa);
    setModalOpen('TAREFA');
  };

  const fecharModal = () => {
    setModalOpen(null);
    setTarefaEditando(null);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Quadro de Tarefas</h2>
        <div className="space-x-3">
          <button
            onClick={() => setModalOpen('TAG')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg font-medium shadow-sm transition cursor-pointer"
          >
            + Tag
          </button>
          <button
            onClick={() => setModalOpen('CATEGORIA')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg font-medium shadow-sm transition cursor-pointer"
          >
            + Categoria
          </button>
          <button
            onClick={() => { setTarefaEditando(null); setModalOpen('TAREFA'); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition cursor-pointer"
          >
            + Nova Tarefa
          </button>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={fecharModal} 
        >
          {/* Modal Tarefa */}
          {modalOpen === 'TAREFA' && (
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()} 
            >
              <h3 className="text-xl font-bold mb-4 border-b border-gray-100 pb-3 text-gray-800">
                {tarefaEditando ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
              </h3>
              <TarefaForm onClose={fecharModal} tarefaToEdit={tarefaEditando ?? undefined} />
            </div>
          )}

          {/* Modal Categoria */}
          {modalOpen === 'CATEGORIA' && (
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 border-b border-gray-100 pb-3 text-gray-800">
                Gerenciar Categorias
              </h3>
              <CategoriasManager />
            </div>
          )}

          {/* Modal Tag */}
          {modalOpen === 'TAG' && (
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 border-b border-gray-100 pb-3 text-gray-800">
                Criar Nova Tag
              </h3>
              <TagsManager />
              {/* Botão de fechar */}
              <button
                onClick={fecharModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          )}

          {/* Modal Histórico */}
          {modalOpen === 'HISTORICO' && tarefaSelecionadaId && (
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <TaskHistory tarefaId={tarefaSelecionadaId} onClose={fecharModal} />
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : tarefas.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-xl border border-dashed border-gray-300 text-gray-500">
          <p className="text-lg">Nenhuma tarefa encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tarefas.map((tarefa) => (
            <div key={tarefa.id} className="relative group">
              <TaskCard tarefa={tarefa} onEdit={abrirEdicao} />
              <button
                onClick={() => abrirHistorico(tarefa.id)}
                className="absolute top-2 right-12 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Ver Log
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};