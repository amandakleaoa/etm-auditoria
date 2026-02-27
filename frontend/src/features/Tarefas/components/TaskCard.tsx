import type { Tarefa } from '../types';
import { StatusBadge } from '../../../components/atoms/StatusBadge';
import { useTaskStore } from '../hooks/useTaskStore';
import { Trash2, Pencil } from 'lucide-react';

type Props = {
  tarefa: Tarefa;
  onEdit: (t: Tarefa) => void;
};

export const TaskCard = ({ tarefa, onEdit }: Props) => {
  const { deletarTarefa } = useTaskStore();

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 truncate pr-4">
            {tarefa.titulo}
          </h3>
          <StatusBadge status={tarefa.status} />
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {tarefa.descricao?? 'Sem descrição...'}
        </p>

        {/* NOVO BLOCO: Renderização das Tags como Badges */}
        {tarefa.tags && tarefa.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tarefa.tags.map((tag) => (
              <span 
                key={tag.id} 
                className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200"
              >
                #{tag.descricao}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full border border-gray-300"
            style={{
              backgroundColor: tarefa.categoria?.corHexadecimal?? '#CCC',
            }}
            title={tarefa.categoria?.nome?? 'Sem categoria'}
          />
          <span className="text-xs font-medium text-gray-500">
            Prioridade: {tarefa.prioridade}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(tarefa)}
            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
            title="Editar Tarefa"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => deletarTarefa(tarefa.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Excluir Tarefa"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};