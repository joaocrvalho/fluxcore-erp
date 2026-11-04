import { Component, input, output } from '@angular/core';
import { ClienteView, TIPO_PESSOA } from '../../Models/cliente-model';
import { formatarDocumento, formatarTelefone } from '../../Utils/cliente';
import { moeda } from '../../Utils/moeda';

@Component({
  selector: 'app-clientes-table',
  templateUrl: './clientes-table.html',
  styleUrl: './clientes-table.css',
})
export class ClientesTable {
  clientes = input.required<ClienteView[]>();
  detalhes = output<ClienteView>();
  editar = output<ClienteView>();

  readonly tipoInfo = TIPO_PESSOA;
  readonly moeda = moeda;
  readonly telefone = formatarTelefone;
  readonly documento = formatarDocumento;
}