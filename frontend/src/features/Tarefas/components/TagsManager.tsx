import { useState } from 'react';
import { useTaskStore } from '../hooks/useTaskStore';
import type { Tag } from '../types';

export const TagsManager = () => {
  const { tags, criarTag, atualizarTag, deletarTag } = useTaskStore();
  const [novaDescricao, setNovaDescricao] = useState<string>(''); // nova tag
  const [editandoId, setEditandoId] = useState<number | null>(null); // tag em edição
  const [descricaoEditando, setDescricaoEditando] = useState<string>(''); // valor do input da tag editando

  const handleCreate = async () => {
    if (!novaDescricao.trim()) return;
    const sucesso = await criarTag({ descricao: novaDescricao });
    if (sucesso) setNovaDescricao('');
  };

  const iniciarEdicao = (tag: Tag) => {
    setEditandoId(tag.id);
    setDescricaoEditando(tag.descricao);
  };

  const salvarEdicao = async (tag: Tag) => {
    if (!descricaoEditando.trim() || descricaoEditando === tag.descricao) {
      setEditandoId(null);
      return;
    }
    await atualizarTag({ id: tag.id, descricao: descricaoEditando });
    setEditandoId(null);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setDescricaoEditando('');
  };

  return (
    <div className="space-y-6">
      <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center space-x-2 border border-gray-200 p-2 rounded-md"
          >
            {editandoId === tag.id ? (
              <>
                <input
                  value={descricaoEditando}
                  onChange={(e) => setDescricaoEditando(e.target.value)}
                  className="flex-1 outline-none border-b border-indigo-500 focus:border-indigo-600 text-sm"
                />
                <button
                  onClick={() => salvarEdicao(tag)}
                  className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Salvar
                </button>
                <button
                  onClick={cancelarEdicao}
                  className="px-3 py-1.5 bg-gray-400 text-white rounded text-xs font-medium hover:bg-gray-500 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm">{tag.descricao}</span>
                <button
                  onClick={() => iniciarEdicao(tag)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => deletarTag(tag.id)}
                  className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Deletar
                </button>
              </>
            )}
          </div>
        ))}

        {tags.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">
            Nenhuma tag cadastrada.
          </p>
        )}
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Nova Tag</h4>
        <div className="flex items-center space-x-2">
          <input
            placeholder="Ex: Urgente, Bug, Reunião"
            value={novaDescricao}
            onChange={(e) => setNovaDescricao(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md p-2 outline-none focus:border-indigo-500 text-sm"
          />
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};