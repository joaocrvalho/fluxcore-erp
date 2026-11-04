export type StatusEstoque = 'baixo' | 'ok';
export type NivelPrioridade = 'critico' | 'atencao';

export interface Produto {
  id: number;
  nome: string;
  sku: string;
  categoria: string;
  quantidade: number;
  minimo: number;
  unidade: string; // já no plural: 'sacos', 'm³', 'galões'...
  custo: number;
  venda: number;
}

// "baixo" não é gravado: é derivado (quantidade abaixo do mínimo)
export type ProdutoView = Produto & { status: StatusEstoque };

export type NovoProduto = Omit<Produto, 'id'>;

export interface Prioridade {
  produto: ProdutoView;
  deficit: number;
  nivel: NivelPrioridade;
}

export const CATEGORIAS_ESTOQUE = [
  'Cimento e derivados',
  'Agregados',
  'Tintas e revestimentos',
  'Alvenaria',
  'Ferragens',
  'Elétrica',
  'Hidráulica',
];

export const UNIDADES = ['unidades', 'sacos', 'm³', 'galões', 'barras', 'metros', 'kg'];

export const STATUS_ESTOQUE: Record<StatusEstoque, { rotulo: string; tom: 'danger' | 'success' }> = {
  baixo: { rotulo: 'Baixo', tom: 'danger' },
  ok: { rotulo: 'Ok', tom: 'success' },
};