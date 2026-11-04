import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddButton } from '../../Components/add-button/add-button';
import { Card } from '../../Components/card/card';
import { Filter } from '../../Components/filter/filter';
import { ModalEdicao } from '../../Components/modal-edicao/modal-edicao';
import { Table } from '../../Components/table/table';
import { TableFilter } from '../../Components/table-filter/table-filter';
import { Title } from '../../Components/title/title';
import { FILTROS_VAZIOS, PERIODO_INICIAL, VENDAS } from '../../Mocks/venda-mock';
import { CardResumo } from '../../Models/dashboard-model';
import {
  FiltroVendas, NovaVenda, PeriodoVendas, STATUS, STATUS_VENDA, StatusVenda,
  TIPO_VENDA, TIPOS, TipoVenda, Venda,
} from '../../Models/venda-model';
import { hojeISO } from '../../Utils/data';

@Component({
  selector: 'app-vendas',
  imports: [
    Title, Card, Filter, AddButton, ModalEdicao, TableFilter, Table,
    ReactiveFormsModule, NgTemplateOutlet,
  ],
  templateUrl: './vendas.html',
  styleUrl: './vendas.css',
})
export class Vendas {
  private vendas = signal<Venda[]>(VENDAS);
  periodo = signal<PeriodoVendas>(PERIODO_INICIAL);
  filtros = signal<FiltroVendas>(FILTROS_VAZIOS);

  // Vendas dentro do período (os cards contam só por período)
  private noPeriodo = computed(() => {
    const { de, ate } = this.periodo();
    return this.vendas().filter((v) => v.data >= de && v.data <= ate);
  });

  // Lista da tabela: período + busca, tipo e status, da mais recente para a mais antiga
  vendasFiltradas = computed(() => {
    const { busca, tipo, status } = this.filtros();
    const termo = busca.trim().toLowerCase();

    return this.noPeriodo()
      .filter(
        (v) =>
          (!termo || v.cliente.toLowerCase().includes(termo)) &&
          (!tipo || v.tipo === tipo) &&
          (!status || v.status === status),
      )
      .sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id);
  });

  cards = computed<CardResumo[]>(() => {
    const lista = this.noPeriodo();
    const contar = (fn: (v: Venda) => boolean) => String(lista.filter(fn).length);

    return [
      { titulo: 'Vendas à vista', valor: contar((v) => v.tipo === 'avista'),
        subtitulo: 'vendas no período', tom: 'success', icone: 'avista', valorEscuro: true },
      { titulo: 'Vendas parceladas', valor: contar((v) => v.tipo.startsWith('parcelado')),
        subtitulo: 'vendas no período', tom: 'neutral', icone: 'parcelado', valorEscuro: true },
      { titulo: 'Prestação de serviço', valor: contar((v) => v.tipo === 'servico'),
        subtitulo: 'vendas no período', tom: 'warning', icone: 'servico', valorEscuro: true },
    ];
  });

  // Amplia o período se a data cair fora dele e limpa os filtros,
  // para a venda criada ou editada continuar visível
  private garantirVisivel(data: string) {
    this.periodo.update((p) => ({
      de: data < p.de ? data : p.de,
      ate: data > p.ate ? data : p.ate,
    }));
    this.filtros.set(FILTROS_VAZIOS);
  }

  adicionar(nova: NovaVenda) {
    const id = Math.max(0, ...this.vendas().map((v) => v.id)) + 1;
    const venda: Venda = {
      ...nova,
      id,
      status: nova.tipo === 'avista' ? 'confirmada' : 'aguardando',
    };
    this.vendas.update((lista) => [venda, ...lista]);
    this.garantirVisivel(nova.data);
  }

  atualizar(id: number, dados: Omit<Venda, 'id'>) {
    this.vendas.update((lista) => lista.map((v) => (v.id === id ? { ...v, ...dados } : v)));
    this.garantirVisivel(dados.data);
  }

  // ---------- Formulário (criação e edição) ----------
  private fb = inject(FormBuilder);
  readonly tipos = TIPOS;
  readonly tipoInfo = TIPO_VENDA;
  readonly statusLista = STATUS;
  readonly statusInfo = STATUS_VENDA;

  // null = criando; com id = editando aquela venda
  editandoId = signal<number | null>(null);

  form = this.fb.nonNullable.group({
    cliente: ['', [Validators.required, Validators.pattern(/\S/)]],
    tipo: ['avista' as TipoVenda, Validators.required],
    data: [hojeISO(), Validators.required],
    valor: [null as number | null, [Validators.required, Validators.min(0.01)]],
    status: ['aguardando' as StatusVenda], // só aparece na edição
  });

  resetarForm() {
    this.editandoId.set(null);
    this.form.reset({ cliente: '', tipo: 'avista', data: hojeISO(), valor: null, status: 'aguardando' });
  }

  salvar(modal: AddButton) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { cliente, tipo, data, valor } = this.form.getRawValue();
    this.adicionar({ cliente: cliente.trim(), tipo, data, valor: valor! });
    modal.fechar();
  }

  editar(venda: Venda, modal: ModalEdicao) {
    this.editandoId.set(venda.id);
    this.form.reset({
      cliente: venda.cliente,
      tipo: venda.tipo,
      data: venda.data,
      valor: venda.valor,
      status: venda.status,
    });
    modal.abrir();
  }

  salvarEdicao(modal: ModalEdicao) {
    const id = this.editandoId();
    if (id === null) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { cliente, tipo, data, valor, status } = this.form.getRawValue();
    this.atualizar(id, { cliente: cliente.trim(), tipo, data, valor: valor!, status });
    modal.fechar();
  }

  invalido(campo: 'cliente' | 'data' | 'valor'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && c.touched;
  }
}