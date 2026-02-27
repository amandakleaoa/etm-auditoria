export interface Categoria {
    id: number;
    nome: string;
    corHexadecimal: string;
}

export interface Tag {
    id: number;
    descricao: string;
}

export interface Tarefa {
    id: number;
    titulo: string;
    descricao: string;
    status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
    prioridade: number;
    dataEntrega: string;
    categoria: Categoria;
    tags: Tag[];
}