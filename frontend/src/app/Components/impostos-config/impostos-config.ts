import { Component, input, output } from '@angular/core';
import { ImpostoConfig } from '../../Models/resultado-model';
import { moedaMil, percentual } from '../../Utils/moeda';

@Component({
  selector: 'app-impostos-config',
  templateUrl: './impostos-config.html',
  styleUrl: './impostos-config.css',
})
export class ImpostosConfig {
  impostos = input.required<ImpostoConfig[]>();
  total = input.required<number>(); // impostos aplicados no mês exibido
  gerenciar = output<void>();

  readonly moedaMil = moedaMil;
  readonly percentual = percentual;
}