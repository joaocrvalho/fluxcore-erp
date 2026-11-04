import { Produto } from '../Models/estoque-model';

export const PRODUTOS: Produto[] = [
  { id: 1, nome: 'Cimento CP-II 50kg', sku: 'CIM-001', categoria: 'Cimento e derivados',
    quantidade: 8, minimo: 30, unidade: 'sacos', custo: 34.5, venda: 47.9 },
  { id: 2, nome: 'Areia Grossa', sku: 'ARE-003', categoria: 'Agregados',
    quantidade: 2, minimo: 10, unidade: 'm³', custo: 120, venda: 168 },
  { id: 3, nome: 'Tinta Branca 18L', sku: 'TIN-012', categoria: 'Tintas e revestimentos',
    quantidade: 3, minimo: 12, unidade: 'galões', custo: 89.9, venda: 129.9 },
  { id: 4, nome: 'Bloco Cerâmico 14cm', sku: 'BLO-007', categoria: 'Alvenaria',
    quantidade: 120, minimo: 500, unidade: 'unidades', custo: 1.8, venda: 2.65 },
  { id: 5, nome: 'Argamassa AC-II 20kg', sku: 'ARG-009', categoria: 'Cimento e derivados',
    quantidade: 32, minimo: 24, unidade: 'sacos', custo: 21.5, venda: 31.9 },
  { id: 6, nome: 'Vergalhão 10mm 12m', sku: 'VER-010', categoria: 'Ferragens',
    quantidade: 74, minimo: 40, unidade: 'barras', custo: 52, venda: 69.9 },
];