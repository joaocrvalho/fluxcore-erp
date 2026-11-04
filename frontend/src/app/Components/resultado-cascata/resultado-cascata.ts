import { Component, computed, input, signal } from '@angular/core';
import { EtapaResultado } from '../../Models/resultado-model';
import { moeda, moedaMil } from '../../Utils/moeda';

interface Barra {
  etapa: EtapaResultado;
  classe: string;
  x: number;
  w: number;
  cx: number;
  y: number;
  altura: number;
  texto: string;
  textoY: number;
  linhas: string[];
  ligacao: { x1: number; x2: number; y: number } | null;
}

// Passo "redondo" do eixo (30k, 50k, 100k...) para uns 3 intervalos
function passo(max: number): number {
  const bruto = max / 3.2;
  const magnitude = Math.pow(10, Math.floor(Math.log10(bruto)));
  const normalizado = bruto / magnitude;
  return ([1, 2, 3, 5, 10].find((k) => k >= normalizado) ?? 10) * magnitude;
}

// Quebra o rótulo em linhas de até `limite` caracteres, sem cortar palavras
function quebrar(texto: string, limite = 14): string[] {
  const linhas: string[] = [];
  let atual = '';
  for (const palavra of texto.split(' ')) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra;
    if (atual && tentativa.length > limite) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = tentativa;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

@Component({
  selector: 'app-resultado-cascata',
  templateUrl: './resultado-cascata.html',
  styleUrl: './resultado-cascata.css',
})
export class ResultadoCascata {
  etapas = input.required<EtapaResultado[]>();
  selecionadaId = signal<string | null>(null);

  // Geometria do SVG
  readonly vbLargura = 1000;
  readonly vbAltura = 310;
  readonly xInicio = 96;
  readonly xFim = 990;
  readonly yTopo = 30;
  readonly yBase = 260;
  readonly yRotulo = this.yBase + 22;

  readonly moeda = moeda;

  readonly g = computed(() => {
    const etapas = this.etapas();
    const vazio = { ticks: [] as { texto: string; y: number }[], barras: [] as Barra[] };
    if (!etapas.length) return vazio;

    // Cada barra vai de `de` até `ate`; as deduções descem a partir do acumulado
    let corrente = 0;
    const trechos = etapas.map((e) => {
      let de = 0;
      let ate = e.valor;
      if (e.tipo === 'deducao') {
        de = corrente;
        ate = corrente - e.valor;
      }
      corrente = ate;
      return { e, de, ate };
    });

    const niveis = trechos.flatMap((t) => [t.de, t.ate]);
    const maximo = Math.max(0, ...niveis);
    const minimo = Math.min(0, ...niveis);
    const topo = (maximo || 1) * 1.08;
    const fundo = minimo < 0 ? minimo * 1.15 : 0;
    const y = (v: number) =>
      this.yTopo + ((topo - v) / (topo - fundo)) * (this.yBase - this.yTopo);

    const p = passo(maximo || 1);
    const ticks: { texto: string; y: number }[] = [];
    for (let v = Math.ceil(fundo / p) * p; v <= topo; v += p) {
      ticks.push({ texto: v === 0 ? 'R$ 0' : `${v < 0 ? '– ' : ''}${moedaMil(v)}`, y: y(v) });
    }

    const slot = (this.xFim - this.xInicio) / etapas.length;
    const w = slot * 0.68;

    const barras = trechos.map((t, i): Barra => {
      const x = this.xInicio + i * slot + (slot - w) / 2;
      const yTopoBarra = y(Math.max(t.de, t.ate));
      const yBaseBarra = y(Math.min(t.de, t.ate));
      const negativa = t.e.tipo === 'resultado' && t.e.valor < 0;

      return {
        etapa: t.e,
        classe: negativa ? 'resultado negativo' : t.e.tipo,
        x, w, cx: x + w / 2,
        y: yTopoBarra,
        altura: Math.max(yBaseBarra - yTopoBarra, 2),
        texto: `${t.e.tipo === 'deducao' || t.e.valor < 0 ? '– ' : ''}${moedaMil(t.e.valor)}`,
        textoY: yTopoBarra - 8,
        linhas: quebrar(t.e.rotulo),
        // Linha tracejada do fim desta barra até o começo da próxima
        ligacao: i < trechos.length - 1 ? { x1: x + w, x2: x + slot, y: y(t.ate) } : null,
      };
    });

    return { ticks, barras };
  });

  detalhe = computed(() => this.etapas().find((e) => e.id === this.selecionadaId()) ?? null);

  alternar(id: string) {
    this.selecionadaId.update((atual) => (atual === id ? null : id));
  }

  // '(-) Custo dos produtos' -> 'Custo dos produtos'
  titulo(etapa: EtapaResultado): string {
    return etapa.rotulo.replace(/^(\(-\)|=)\s*/, '');
  }
}