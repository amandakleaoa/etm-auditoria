import { create } from 'zustand';
import { api } from '../../../core/api/axiosInstance';
import type { Tarefa, Categoria, Tag } from '../types';
import toast from 'react-hot-toast';

export type CriarTarefaDTO = {
  titulo: string;
  descricao?: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
  prioridade: number;
  categoriaId: number;
  tagIds?: number[];
};

interface TaskState {
  tarefas: Tarefa[];
  categorias: Categoria[];
  tags: Tag[];
  loading: boolean;
  fetchTarefas: () => Promise<void>;
  fetchCategorias: () => Promise<void>;
  fetchTags: () => Promise<void>;
  deletarTarefa: (id: number) => Promise<void>;
  criarTarefa: (dados: CriarTarefaDTO) => Promise<boolean>;
  atualizarTarefa: (id: number, dados: CriarTarefaDTO) => Promise<boolean>;
  criarCategoria: (dados: { nome: string; corHexadecimal: string }) => Promise<boolean>;
  atualizarCategoria: (dados: Categoria) => Promise<boolean>;
  deletarCategoria: (id: number) => Promise<void>;
  criarTag: (dados: { descricao: string }) => Promise<boolean>;
  atualizarTag: (dados: Tag) => Promise<boolean>;
  deletarTag: (id: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tarefas: [],
  categorias: [],
  tags: [],
  loading: false,

  fetchTarefas: async () => {
    set({ loading: true });
    try {
      const response = await api.get<Tarefa[]>('/tarefas');
      set({ tarefas: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Erro ao buscar tarefas', error);
    }
  },

  fetchCategorias: async () => {
    try {
      const response = await api.get<Categoria[]>('/categorias');
      set({ categorias: response.data });
    } catch (error) {
      console.error('Erro ao buscar categorias', error);
    }
  },

  fetchTags: async () => {
    try {
      const response = await api.get<Tag[]>('/tags');
      set({ tags: response.data });
    } catch (error) {
      console.error('Erro ao buscar tags', error);
    }
  },

  criarTarefa: async (dados) => {
    try {
      const existe = get().tarefas.some(
        (t) => t.titulo === dados.titulo && t.categoria?.id === dados.categoriaId
      );
      if (existe) {
        toast.error('Já existe uma tarefa com esse título nesta categoria.');
        return false;
      }
      const response = await api.post<Tarefa>('/tarefas', dados);
      set((state) => ({ tarefas: [...state.tarefas, response.data] }));
      toast.success('Tarefa criada com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao criar tarefa');
      return false;
    }
  },

  atualizarTarefa: async (id: number, dados: CriarTarefaDTO): Promise<boolean> => {
    try {
      const response = await api.put<Tarefa>(`/tarefas/${id}`, dados);
      set((state) => ({
        tarefas: state.tarefas.map((t) => (t.id === id ? response.data : t)),
      }));
      toast.success('Tarefa atualizada com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao atualizar tarefa');
      return false;
    }
  },

  deletarTarefa: async (id: number) => {
    try {
      await api.delete(`/tarefas/${id}`);
      set((state) => ({
        tarefas: state.tarefas.filter((t) => t.id !== id),
      }));
      toast.success('Tarefa movida para a lixeira com sucesso.');
    } catch (error) {
      toast.error('Erro ao deletar tarefa');
    }
  },

  criarCategoria: async (dados) => {
    try {
      const existe = get().categorias.some((c) => c.nome === dados.nome);
      if (existe) {
        toast.error('Já existe uma categoria com esse nome.');
        return false;
      }
      const response = await api.post<Categoria>('/categorias', dados);
      set((state) => ({ categorias: [...state.categorias, response.data] }));
      toast.success('Categoria criada com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao criar categoria');
      return false;
    }
  },

  atualizarCategoria: async (dados: Categoria): Promise<boolean> => {
    try {
      const response = await api.put<Categoria>(`/categorias/${dados.id}`, dados);
      set((state) => ({
        categorias: state.categorias.map((c) => (c.id === dados.id ? response.data : c)),
      }));
      toast.success('Categoria atualizada com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao atualizar categoria');
      return false;
    }
  },

  deletarCategoria: async (id: number): Promise<void> => {
    try {
      await api.delete(`/categorias/${id}`);
      set((state) => ({
        categorias: state.categorias.filter((c) => c.id !== id),
        tarefas: state.tarefas.map((t) =>
          t.categoria?.id === id
            ? { ...t, categoria: { id: 0, nome: 'Sem categoria', corHexadecimal: '#000000' } }
            : t
        ),
      }));
      toast.success('Categoria deletada com sucesso!');
    } catch (error) {
      toast.error('Erro ao deletar categoria');
    }
  },

  criarTag: async (dados) => {
    try {
      const existe = get().tags.some(
        (t) => t.descricao.toLowerCase() === dados.descricao.toLowerCase()
      );
      if (existe) {
        toast.error('Já existe uma tag com esse nome.');
        return false;
      }
      const response = await api.post<Tag>('/tags', dados);
      set((state) => ({ tags: [...state.tags, response.data] }));
      toast.success('Tag criada com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao criar tag');
      return false;
    }
  },

  atualizarTag: async (dados: Tag): Promise<boolean> => {
    try {
      const response = await api.put<Tag>(`/tags/${dados.id}`, dados);
      set((state) => ({
        tags: state.tags.map((t) => (t.id === dados.id ? response.data : t)),
      }));
      toast.success('Tag atualizada com sucesso!');
      return true;
    } catch (error) {
      toast.error('Erro ao atualizar tag');
      return false;
    }
  },

  deletarTag: async (id: number): Promise<void> => {
    try {
      await api.delete(`/tags/${id}`);
      set((state) => ({
        tags: state.tags.filter((t) => t.id !== id),
        tarefas: state.tarefas.map((t) => ({
          ...t,
          tags: t.tags ? t.tags.filter((tag) => tag.id !== id) : [],
        })),
      }));
      toast.success('Tag deletada com sucesso!');
    } catch (error) {
      toast.error('Erro ao deletar tag');
    }
  },
}));