export type TipoEtapa = 'receita' | 'deducao' | 'subtotal' | 'resultado';

export interface ItemResultado {
  rotulo: string;
  valor: number;
}

// Uma barra da cascata. Para 'deducao', valor é a magnitude (positiva)
export interface EtapaResultado {
  id: string;
  rotulo: string;
  tipo: TipoEtapa;
  valor: number;
  detalhes: ItemResultado[];
}

// Dados brutos de um mês: as etapas são calculadas a partir deles
export interface ResultadoMes {
  id: string; // 'YYYY-MM'
  rotulo: string;
  receitas: ItemResultado[];
  impostos: ItemResultado[];
  custos: ItemResultado[];
  outrasFixas: number; // despesas fixas além das recorrentes
  variaveis: ItemResultado[];
}

export interface DespesaFixa {
  id: number;
  descricao: string;
  dia: number;
  valor: number;
}

export interface ImpostoConfig {
  id: number;
  nome: string;
  base: string;
  aliquota: number; // em %
  ativo: boolean;
}