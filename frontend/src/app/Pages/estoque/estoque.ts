import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddButton } from '../../Components/add-button/add-button';
import { EstoqueAjuste } from '../../Components/estoque-ajuste/estoque-ajuste';
import { EstoqueTable } from '../../Components/estoque-table/estoque-table';
import { PrioridadesCompra } from '../../Components/prioridades-compra/prioridades-compra';
import { Title } from '../../Components/title/title';
import { PRODUTOS } from '../../Mocks/estoque-mock';
import {
  CATEGORIAS_ESTOQUE, NovoProduto, Produto, ProdutoView, UNIDADES,
} from '../../Models/estoque-model';
import { comStatus, prioridades } from '../../Utils/estoque';

// Busca sem diferenciar maiúsculas e acentos
function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

@Component({
  selector: 'app-estoque',
  imports: [Title, AddButton, EstoqueTable, EstoqueAjuste, PrioridadesCompra, ReactiveFormsModule],
  templateUrl: './estoque.html',
  styleUrl: './estoque.css',
})
export class Estoque {
  private produtos = signal<Produto[]>(PRODUTOS);
  busca = signal('');

  private todos = computed<ProdutoView[]>(() => this.produtos().map(comStatus));

  // Tabela: busca por nome ou código, com os produtos em falta primeiro
  lista = computed(() => {
    const termo = normalizar(this.busca().trim());

    return this.todos()
      .filter((p) => !termo || normalizar(p.nome).includes(termo) || normalizar(p.sku).includes(termo))
      .sort((a, b) => Number(b.status === 'baixo') - Number(a.status === 'baixo'));
  });

  // O painel de prioridades não segue a busca: sempre mostra todos os produtos em falta
  prioridades = computed(() => prioridades(this.todos()));

  atualizarQuantidade(evento: { id: number; quantidade: number }) {
    this.produtos.update((lista) =>
      lista.map((p) => (p.id === evento.id ? { ...p, quantidade: evento.quantidade } : p)),
    );
  }

  adicionar(novo: NovoProduto) {
    const id = Math.max(0, ...this.produtos().map((p) => p.id)) + 1;
    this.produtos.update((lista) => [...lista, { ...novo, id }]);
    this.busca.set(''); // garante que o produto novo apareça
  }

  // ---------- Formulário do modal ----------
  private fb = inject(FormBuilder);
  readonly categorias = CATEGORIAS_ESTOQUE;
  readonly unidades = UNIDADES;

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.pattern(/\S/)]],
    sku: ['', [Validators.required, Validators.pattern(/\S/)]],
    categoria: [CATEGORIAS_ESTOQUE[0], Validators.required],
    unidade: [UNIDADES[0], Validators.required],
    quantidade: [null as number | null, [Validators.required, Validators.min(0)]],
    minimo: [null as number | null, [Validators.required, Validators.min(0)]],
    custo: [null as number | null, [Validators.required, Validators.min(0.01)]],
    venda: [null as number | null, [Validators.required, Validators.min(0.01)]],
  });

  resetarForm() {
    this.form.reset({
      nome: '', sku: '', categoria: CATEGORIAS_ESTOQUE[0], unidade: UNIDADES[0],
      quantidade: null, minimo: null, custo: null, venda: null,
    });
  }

  salvar(modal: AddButton) {
    const f = this.form.getRawValue();
    const sku = f.sku.trim().toUpperCase();

    if (this.produtos().some((p) => p.sku === sku)) {
      this.form.controls.sku.setErrors({ duplicado: true });
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.adicionar({
      nome: f.nome.trim(),
      sku,
      categoria: f.categoria,
      unidade: f.unidade,
      quantidade: f.quantidade!,
      minimo: f.minimo!,
      custo: f.custo!,
      venda: f.venda!,
    });
    modal.fechar();
  }

  invalido(campo: 'nome' | 'sku' | 'quantidade' | 'minimo' | 'custo' | 'venda'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && c.touched;
  }

  skuDuplicado(): boolean {
    return this.form.controls.sku.hasError('duplicado');
  }
}