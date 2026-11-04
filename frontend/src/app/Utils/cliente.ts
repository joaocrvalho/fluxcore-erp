import { TipoPessoa } from '../Models/cliente-model';

export function soDigitos(texto: string): string {
  return texto.replace(/\D/g, '');
}

// '38427591008' -> '384.275.910-08' | '42817563000119' -> '42.817.563/0001-19'
export function formatarDocumento(digitos: string, tipo: TipoPessoa): string {
  const d = digitos;
  if (tipo === 'fisica' && d.length === 11) {
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  }
  if (tipo === 'juridica' && d.length === 14) {
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  }
  return d;
}

// '11987421630' -> '(11) 98742-1630' | '1134562290' -> '(11) 3456-2290'
export function formatarTelefone(digitos: string): string {
  const d = digitos;
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return d;
}

// Busca sem diferenciar maiúsculas e acentos
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}