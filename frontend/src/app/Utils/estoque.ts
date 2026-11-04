import { Prioridade, ProdutoView, Produto } from '../Models/estoque-model';

const formatoNumero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

export function numero(valor: number): string {
  return formatoNumero.format(valor);
}

export function comStatus(p: Produto): ProdutoView {
  return { ...p, status: p.quantidade < p.minimo ? 'baixo' : 'ok' };
}

// Produtos abaixo do mínimo, do maior déficit para o menor.
// Regra provisória do mock: déficit de 20 ou mais = crítico. Com o backend, vem da API.
export function prioridades(lista: ProdutoView[]): Prioridade[] {
  return lista
    .filter((p) => p.status === 'baixo')
    .map((p): Prioridade => {
      const deficit = p.minimo - p.quantidade;
      return { produto: p, deficit, nivel: deficit >= 20 ? 'critico' : 'atencao' };
    })
    .sort((a, b) => b.deficit - a.deficit);
}