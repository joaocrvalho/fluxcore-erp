import { DespesaFixa, ImpostoConfig, ResultadoMes } from '../Models/resultado-model';

export const MES_INICIAL = '2026-08';

export const MESES_RESULTADO: ResultadoMes[] = [
  {
    id: '2026-06', rotulo: 'Junho 2026',
    receitas: [
      { rotulo: 'Vendas à vista', valor: 27000 },
      { rotulo: 'Vendas parceladas', valor: 33000 },
      { rotulo: 'Prestação de serviço', valor: 19000 },
    ],
    impostos: [
      { rotulo: 'Simples Nacional', valor: 4740 },
      { rotulo: 'ISS', valor: 710 },
    ],
    custos: [
      { rotulo: 'Cimento e argamassas', valor: 12000 },
      { rotulo: 'Pisos e revestimentos', valor: 8500 },
      { rotulo: 'Tintas', valor: 6000 },
      { rotulo: 'Material elétrico', valor: 5000 },
      { rotulo: 'Hidráulica', valor: 4500 },
    ],
    outrasFixas: 600,
    variaveis: [
      { rotulo: 'Fretes', valor: 2600 },
      { rotulo: 'Comissões', valor: 2100 },
      { rotulo: 'Marketing', valor: 800 },
      { rotulo: 'Combustível', valor: 600 },
    ],
  },
  {
    id: '2026-07', rotulo: 'Julho 2026',
    receitas: [
      { rotulo: 'Vendas à vista', valor: 29000 },
      { rotulo: 'Vendas parceladas', valor: 35000 },
      { rotulo: 'Prestação de serviço', valor: 20000 },
    ],
    impostos: [
      { rotulo: 'Simples Nacional', valor: 5040 },
      { rotulo: 'ISS', valor: 760 },
    ],
    custos: [
      { rotulo: 'Cimento e argamassas', valor: 13000 },
      { rotulo: 'Pisos e revestimentos', valor: 9000 },
      { rotulo: 'Tintas', valor: 6500 },
      { rotulo: 'Material elétrico', valor: 5000 },
      { rotulo: 'Hidráulica', valor: 4500 },
    ],
    outrasFixas: 1400,
    variaveis: [
      { rotulo: 'Fretes', valor: 2800 },
      { rotulo: 'Comissões', valor: 2300 },
      { rotulo: 'Marketing', valor: 1000 },
      { rotulo: 'Combustível', valor: 564 },
    ],
  },
  {
    id: '2026-08', rotulo: 'Agosto 2026',
    receitas: [
      { rotulo: 'Vendas à vista', valor: 31400 },
      { rotulo: 'Vendas parceladas', valor: 38900 },
      { rotulo: 'Prestação de serviço', valor: 21500 },
    ],
    impostos: [
      { rotulo: 'Simples Nacional', valor: 5508 },
      { rotulo: 'ISS', valor: 892 },
    ],
    custos: [
      { rotulo: 'Cimento e argamassas', valor: 14200 },
      { rotulo: 'Pisos e revestimentos', valor: 9800 },
      { rotulo: 'Tintas', valor: 7100 },
      { rotulo: 'Material elétrico', valor: 5400 },
      { rotulo: 'Hidráulica', valor: 4800 },
    ],
    outrasFixas: 1900,
    variaveis: [
      { rotulo: 'Fretes', valor: 3100 },
      { rotulo: 'Comissões', valor: 2600 },
      { rotulo: 'Marketing', valor: 1500 },
      { rotulo: 'Combustível', valor: 1000 },
    ],
  },
];

// Somam R$ 16.600,00 por mês
export const DESPESAS_FIXAS: DespesaFixa[] = [
  { id: 1, descricao: 'Aluguel do imóvel', dia: 5, valor: 4500 },
  { id: 2, descricao: 'Salários e encargos', dia: 5, valor: 8800 },
  { id: 3, descricao: 'Internet e telefone', dia: 10, valor: 380 },
  { id: 4, descricao: 'Serviços de contabilidade', dia: 15, valor: 820 },
  { id: 5, descricao: 'Energia elétrica', dia: 20, valor: 620 },
  { id: 6, descricao: 'Seguro do estabelecimento', dia: 1, valor: 1480 },
];

export const IMPOSTOS_CONFIG: ImpostoConfig[] = [
  { id: 1, nome: 'Simples Nacional', base: 'sobre faturamento bruto', aliquota: 6, ativo: true },
  { id: 2, nome: 'ISS', base: 'sobre receita de serviços', aliquota: 1, ativo: true },
];