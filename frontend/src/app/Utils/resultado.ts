import { DespesaFixa, EtapaResultado, ItemResultado, ResultadoMes } from '../Models/resultado-model';

const soma = (itens: ItemResultado[]) => itens.reduce((total, i) => total + i.valor, 0);

export function calcularEtapas(mes: ResultadoMes, fixas: DespesaFixa[]): EtapaResultado[] {
  const itensFixas: ItemResultado[] = fixas.map((f) => ({ rotulo: f.descricao, valor: f.valor }));
  if (mes.outrasFixas > 0) {
    itensFixas.push({ rotulo: 'Outras despesas fixas', valor: mes.outrasFixas });
  }

  const receita = soma(mes.receitas);
  const impostos = soma(mes.impostos);
  const liquida = receita - impostos;
  const custos = soma(mes.custos);
  const bruto = liquida - custos;
  const despesasFixas = soma(itensFixas);
  const despesasVariaveis = soma(mes.variaveis);
  const liquido = bruto - despesasFixas - despesasVariaveis;

  return [
    { id: 'receita', rotulo: 'Receita de Vendas', tipo: 'receita', valor: receita,
      detalhes: mes.receitas },
    { id: 'impostos', rotulo: '(-) Impostos sobre vendas', tipo: 'deducao', valor: impostos,
      detalhes: mes.impostos },
    { id: 'liquida', rotulo: '= Receita Líquida', tipo: 'subtotal', valor: liquida,
      detalhes: [
        { rotulo: 'Receita de vendas', valor: receita },
        { rotulo: '(–) Impostos sobre vendas', valor: impostos },
      ] },
    { id: 'custos', rotulo: '(-) Custo dos produtos', tipo: 'deducao', valor: custos,
      detalhes: mes.custos },
    { id: 'bruto', rotulo: '= Lucro Bruto', tipo: 'subtotal', valor: bruto,
      detalhes: [
        { rotulo: 'Receita líquida', valor: liquida },
        { rotulo: '(–) Custo dos produtos', valor: custos },
      ] },
    { id: 'fixas', rotulo: '(-) Despesas Fixas', tipo: 'deducao', valor: despesasFixas,
      detalhes: itensFixas },
    { id: 'variaveis', rotulo: '(-) Despesas Variáveis', tipo: 'deducao', valor: despesasVariaveis,
      detalhes: mes.variaveis },
    { id: 'liquido', rotulo: '= Lucro Líquido', tipo: 'resultado', valor: liquido,
      detalhes: [
        { rotulo: 'Lucro bruto', valor: bruto },
        { rotulo: '(–) Despesas fixas', valor: despesasFixas },
        { rotulo: '(–) Despesas variáveis', valor: despesasVariaveis },
      ] },
  ];
}

export function lucroLiquido(etapas: EtapaResultado[]): number {
  return etapas[etapas.length - 1].valor;
}