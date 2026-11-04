import { Component, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Produto } from '../../Models/estoque-model';
import { numero } from '../../Utils/estoque';

type Movimento = 'entrada' | 'saida' | 'definir';

@Component({
  selector: 'app-estoque-ajuste',
  imports: [ReactiveFormsModule],
  templateUrl: './estoque-ajuste.html',
  styleUrl: './estoque-ajuste.css',
})
export class EstoqueAjuste {
  confirmou = output<{ id: number; quantidade: number }>();

  private dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private fb = inject(FormBuilder);

  produto = signal<Produto | null>(null);
  erroSaida = signal(false);

  readonly numero = numero;
  readonly movimentos: { valor: Movimento; rotulo: string }[] = [
    { valor: 'entrada', rotulo: 'Entrada (somar ao estoque)' },
    { valor: 'saida', rotulo: 'Saída (retirar do estoque)' },
    { valor: 'definir', rotulo: 'Definir quantidade total' },
  ];

  form = this.fb.nonNullable.group({
    movimento: ['entrada' as Movimento, Validators.required],
    quantidade: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  abrir(produto: Produto) {
    this.produto.set(produto);
    this.erroSaida.set(false);
    this.form.reset({ movimento: 'entrada', quantidade: null });
    this.dialog().nativeElement.showModal();
  }

  fechar() {
    this.dialog().nativeElement.close();
  }

  salvar() {
    const p = this.produto();
    if (!p) return;

    this.erroSaida.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { movimento, quantidade } = this.form.getRawValue();
    const q = quantidade!;

    if (movimento === 'saida' && q > p.quantidade) {
      this.erroSaida.set(true);
      return;
    }

    const nova =
      movimento === 'entrada' ? p.quantidade + q
      : movimento === 'saida' ? p.quantidade - q
      : q;

    this.confirmou.emit({ id: p.id, quantidade: Math.round(nova * 100) / 100 });
    this.fechar();
  }

  invalido(): boolean {
    const c = this.form.controls.quantidade;
    return c.invalid && c.touched;
  }
}