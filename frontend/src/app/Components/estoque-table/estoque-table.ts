import { Component, input, output } from '@angular/core';
import { ProdutoView, STATUS_ESTOQUE } from '../../Models/estoque-model';
import { moeda } from '../../Utils/moeda';
import { numero } from '../../Utils/estoque';

@Component({
  selector: 'app-estoque-table',
  templateUrl: './estoque-table.html',
  styleUrl: './estoque-table.css',
})
export class EstoqueTable {
  produtos = input.required<ProdutoView[]>();
  gerenciar = output<ProdutoView>();

  readonly statusInfo = STATUS_ESTOQUE;
  readonly moeda = moeda;
  readonly numero = numero;
}