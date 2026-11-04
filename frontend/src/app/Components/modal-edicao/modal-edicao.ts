import { Component, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-modal-edicao',
  templateUrl: './modal-edicao.html',
  styleUrl: './modal-edicao.css',
})
export class ModalEdicao {
  titulo = input.required<string>();
  textoSalvar = input('Salvar alterações');

  salvou = output<void>(); // a página valida e grava

  private dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  abrir() {
    this.dialog().nativeElement.showModal();
  }

  fechar() {
    this.dialog().nativeElement.close();
  }

  enviar(evento: Event) {
    evento.preventDefault();
    this.salvou.emit();
  }
}