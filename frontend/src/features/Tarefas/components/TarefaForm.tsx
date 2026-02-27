import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTaskStore } from '../hooks/useTaskStore';
import type { Tarefa } from '../types';

const statusEnum = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'] as const;

const schema = z.object({
  titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  status: z.enum(statusEnum),
  prioridade: z.number().min(1).max(3),
  categoriaId: z.number().min(1, 'Selecione uma categoria válida'),
  tagIds: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  onClose: () => void;
  tarefaToEdit?: Tarefa;
};

export const TarefaForm = ({ onClose, tarefaToEdit }: Props) => {
  const { categorias, tags, criarTarefa, atualizarTarefa } = useTaskStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: tarefaToEdit
      ? {
          titulo: tarefaToEdit.titulo,
          descricao: tarefaToEdit.descricao ?? '',
          status: tarefaToEdit.status,
          prioridade: tarefaToEdit.prioridade,
          categoriaId: tarefaToEdit.categoria?.id ?? 0,
          tagIds: tarefaToEdit.tags?.map((t) => String(t.id)) ?? [],
        }
      : {
          titulo: '',
          descricao: '',
          status: 'PENDENTE',
          prioridade: 2,
          categoriaId: 0,
          tagIds: [],
        },
  });

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      tagIds: data.tagIds ? data.tagIds.map(Number) : [],
    };

    const sucesso = tarefaToEdit
      ? await atualizarTarefa(tarefaToEdit.id, payload)
      : await criarTarefa(payload);

    if (sucesso) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input
          {...register('titulo')}
          className="mt-1 w-full border border-gray-300 rounded-md p-2 outline-none focus:border-indigo-500"
        />
        {errors.titulo && (
          <span className="text-red-500 text-xs">{errors.titulo.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          {...register('descricao')}
          rows={3}
          className="mt-1 w-full border border-gray-300 rounded-md p-2 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('status')}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 outline-none"
          >
            <option value="PENDENTE">Pendente</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDA">Concluída</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prioridade</label>
          <select
            {...register('prioridade', { valueAsNumber: true })}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 outline-none"
          >
            <option value={1}>Alta (1)</option>
            <option value={2}>Média (2)</option>
            <option value={3}>Baixa (3)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Categoria</label>
        <select
          {...register('categoriaId', { valueAsNumber: true })}
          className="mt-1 w-full border border-gray-300 rounded-md p-2 outline-none"
        >
          <option value={0}>Selecione uma categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        {errors.categoriaId && (
          <span className="text-red-500 text-xs">{errors.categoriaId.message}</span>
        )}
      </div>

      {/* Checkbox de Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <label key={t.id} className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                value={t.id}
                {...register('tagIds')}
                defaultChecked={tarefaToEdit?.tags?.some(tag => tag.id === t.id)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="text-gray-700">{t.descricao}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
      >
        Salvar
      </button>
    </form>
  );
};