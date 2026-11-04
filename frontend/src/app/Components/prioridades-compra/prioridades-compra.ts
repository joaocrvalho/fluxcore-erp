import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NivelPrioridade, Prioridade } from '../../Models/estoque-model';
import { numero } from '../../Utils/estoque';

@Component({
  selector: 'app-prioridades-compra',
  imports: [RouterLink],
  templateUrl: './prioridades-compra.html',
  styleUrl: './prioridades-compra.css',
})
export class PrioridadesCompra {
  itens = input.required<Prioridade[]>();

  readonly nivelInfo: Record<NivelPrioridade, { rotulo: string; tom: 'danger' | 'warning' }> = {
    critico: { rotulo: 'Crítico', tom: 'danger' },
    atencao: { rotulo: 'Atenção', tom: 'warning' },
  };

  readonly numero = numero;
}