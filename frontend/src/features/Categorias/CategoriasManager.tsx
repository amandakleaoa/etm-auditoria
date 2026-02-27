import { useState, useEffect, useRef } from 'react';
import { useTaskStore } from '../Tarefas/hooks/useTaskStore';
import type { Categoria } from '../Tarefas/types';

export const CategoriasManager = ({ onClose }: { onClose?: () => void }) => {
  const { categorias, fetchCategorias, criarCategoria, atualizarCategoria, deletarCategoria } = useTaskStore();
  const [novaCategoria, setNovaCategoria] = useState({ nome: '', corHexadecimal: '#000000' });
  const [editandoCategoria, setEditandoCategoria] = useState<Categoria | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Fecha modal ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleCriar = async () => {
    if (!novaCategoria.nome.trim()) return;
    await criarCategoria(novaCategoria);
    setNovaCategoria({ nome: '', corHexadecimal: '#000000' });
  };

  const handleAtualizar = async () => {
    if (!editandoCategoria) return;
    await atualizarCategoria(editandoCategoria);
    setEditandoCategoria(null);
  };

  const handleDeletar = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
      await deletarCategoria(id);
    }
  };

  return (
    <div
      ref={containerRef}
      className="p-6 bg-white rounded-xl shadow-xl max-w-lg mx-auto relative z-50"
    >
      <h2 className="text-xl font-bold mb-4">Gerenciar Categorias</h2>

      {/* Lista de categorias */}
      <ul className="mb-6 space-y-2">
        {categorias.map((c: Categoria) => (
          <li key={c.id} className="flex items-center justify-between p-2 border rounded">
            {editandoCategoria?.id === c.id ? (
              <>
                <input
                  type="text"
                  value={editandoCategoria.nome}
                  onChange={(e) =>
                    setEditandoCategoria({ ...editandoCategoria, nome: e.target.value })
                  }
                  className="border p-1 rounded mr-2 flex-1"
                />
                <input
                  type="color"
                  value={editandoCategoria.corHexadecimal}
                  onChange={(e) =>
                    setEditandoCategoria({ ...editandoCategoria, corHexadecimal: e.target.value })
                  }
                  className="mr-2"
                />
                <button
                  onClick={handleAtualizar}
                  className="px-2 py-1 bg-green-600 text-white rounded mr-1"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditandoCategoria(null)}
                  className="px-2 py-1 bg-gray-300 rounded"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{c.nome}</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: c.corHexadecimal }} />
                  <button
                    onClick={() => setEditandoCategoria(c)}
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeletar(c.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Deletar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Form de nova categoria */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Nova Categoria</h3>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Nome da categoria"
            value={novaCategoria.nome}
            onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })}
            className="border p-1 rounded flex-1"
          />
          <input
            type="color"
            value={novaCategoria.corHexadecimal}
            onChange={(e) => setNovaCategoria({ ...novaCategoria, corHexadecimal: e.target.value })}
          />
          <button onClick={handleCriar} className="px-3 py-1 bg-indigo-600 text-white rounded">
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};