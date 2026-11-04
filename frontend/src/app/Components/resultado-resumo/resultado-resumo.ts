import { Component, computed, input } from '@angular/core';
import { moedaMil } from '../../Utils/moeda';

@Component({
  selector: 'app-resultado-resumo',
  templateUrl: './resultado-resumo.html',
  styleUrl: './resultado-resumo.css',
})
export class ResultadoResumo {
  resultado = input.required<number>();
  receita = input.required<number>();
  periodo = input.required<string>();
  variacao = input<number | null>(null); // % em relação ao mês anterior

  positivo = computed(() => this.resultado() >= 0);
  resultadoTexto = computed(
    () => `${this.positivo() ? '+' : '–'} ${moedaMil(this.resultado())}`,
  );

  margem = computed(() => (this.receita() ? (this.resultado() / this.receita()) * 100 : 0));
  margemTexto = computed(() => `${Math.round(this.margem())}%`);
  receitaTexto = computed(() => moedaMil(this.receita()));

  variacaoBoa = computed(() => (this.variacao() ?? 0) >= 0);
  variacaoTexto = computed(() => {
    const v = this.variacao();
    if (v === null) return '—';
    return `${v >= 0 ? '↑ +' : '↓ –'}${Math.round(Math.abs(v))}%`;
  });
}