type Status = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';

export const StatusBadge = ({ status }: { status: Status }) => {
    const cores: Record<Status, string> = {
        PENDENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        EM_ANDAMENTO: 'bg-blue-100 text-blue-800 border-blue-200',
        CONCLUIDA: 'bg-green-100 text-green-800 border-green-200'
    };
    
    const formatado = status.replace('_', ' ');

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cores[status]}`}>
            {formatado}
        </span>
    );
};