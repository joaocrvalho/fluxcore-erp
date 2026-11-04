export type TipoPessoa = 'fisica' | 'juridica';
export type OrdemClientes = 'nome-asc' | 'nome-desc' | 'valor-desc' | 'valor-asc';

export interface Cliente {
  id: number;
  nome: string;
  tipo: TipoPessoa;
  documento: string; // só dígitos
  telefone: string; // só dígitos
}

export type NovoCliente = Omit<Cliente, 'id'>;

export interface Pendencia {
  descricao: string;
  vencimento: string | null; // 'YYYY-MM-DD'
  valor: number;
  atrasada: boolean;
}

// Valor em aberto e atraso são derivados das pendências do cliente
export interface ClienteView extends Cliente {
  pendencias: Pendencia[];
  emAberto: number;
  atrasado: boolean;
}

export const TIPO_PESSOA: Record<TipoPessoa, { rotulo: string; documento: string }> = {
  fisica: { rotulo: 'Pessoa física', documento: 'CPF' },
  juridica: { rotulo: 'Pessoa jurídica', documento: 'CNPJ' },
};

export const ORDENS: { valor: OrdemClientes; rotulo: string }[] = [
  { valor: 'nome-asc', rotulo: 'Nome · A–Z' },
  { valor: 'nome-desc', rotulo: 'Nome · Z–A' },
  { valor: 'valor-desc', rotulo: 'Maior valor em aberto' },
  { valor: 'valor-asc', rotulo: 'Menor valor em aberto' },
];