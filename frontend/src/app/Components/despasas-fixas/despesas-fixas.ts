import { Component, computed, input, output } from '@angular/core';
import { DespesaFixa } from '../../Models/resultado-model';
import { moeda, moedaMil } from '../../Utils/moeda';

@Component({
  selector: 'app-despesas-fixas',
  templateUrl: './despesas-fixas.html',
  styleUrl: "./despesas-fixas.css",
})
export class DespesasFixas {
  despesas = input.required<DespesaFixa[]>();
  gerenciar = output<void>();

  totalTexto = computed(
    () => `${moedaMil(this.despesas().reduce((total, d) => total + d.valor, 0))}/mês`,
  );

  readonly moeda = moeda;
}