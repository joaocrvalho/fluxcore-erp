import { DatePipe } from '@angular/common';
import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { ClienteView, TIPO_PESSOA } from '../../Models/cliente-model';
import { formatarDocumento, formatarTelefone } from '../../Utils/cliente';
import { moeda } from '../../Utils/moeda';

@Component({
  selector: 'app-cliente-detalhes',
  imports: [DatePipe],
  templateUrl: './clientes-detalhes.html',
  styleUrl: './clientes-detalhes.css',
})
export class ClienteDetalhes {
  cliente = signal<ClienteView | null>(null);

  private dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  readonly tipoInfo = TIPO_PESSOA;
  readonly moeda = moeda;
  readonly telefone = formatarTelefone;
  readonly documento = formatarDocumento;

  abrir(cliente: ClienteView) {
    this.cliente.set(cliente);
    this.dialog().nativeElement.showModal();
  }

  fechar() {
    this.dialog().nativeElement.close();
  }
}