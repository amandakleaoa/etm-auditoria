import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTaskStore } from '../hooks/useTaskStore';

const schema = z.object({
    nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    corHexadecimal: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida (ex: #FF0000)'),
});

type FormData = z.infer<typeof schema>;

export const CategoriaForm = ({ onClose }: { onClose: () => void }) => {
    const { criarCategoria } = useTaskStore();
    
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { corHexadecimal: '#3B82F6' }
    });

    const onSubmit = async (data: FormData) => {
        const sucesso = await criarCategoria(data);
        if (sucesso) onClose();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nome da Categoria</label>
                <input {...register('nome')} placeholder="Ex: Pessoal" className="mt-1 w-full border border-gray-300 rounded-md p-2 outline-none focus:border-indigo-500" />
                {errors.nome && <span className="text-red-500 text-xs">{errors.nome.message}</span>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Cor (Hexadecimal)</label>
                <div className="flex gap-2 mt-1">
                    <input type="color" {...register('corHexadecimal')} className="h-10 w-14 border border-gray-300 rounded-md cursor-pointer" />
                    <input type="text" {...register('corHexadecimal')} className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-indigo-500" />
                </div>
                {errors.corHexadecimal && <span className="text-red-500 text-xs">{errors.corHexadecimal.message}</span>}
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">Salvar</button>
            </div>
        </form>
    );
};