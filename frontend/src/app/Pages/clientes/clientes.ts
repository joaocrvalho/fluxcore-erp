import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddButton } from '../../Components/add-button/add-button';
import { ClienteDetalhes } from '../../Components/clientes-detalhes/clientes-detalhes';
import { ClientesTable } from '../../Components/clientes-table/clientes-table';
import { ModalEdicao } from '../../Components/modal-edicao/modal-edicao';
import { Title } from '../../Components/title/title';
import { CLIENTES } from '../../Mocks/cliente-mock';
import { HOJE } from '../../Mocks/conta-pagar-mock';
import { CONTAS_RECEBER } from '../../Mocks/conta-receber-mock';
import {
  Cliente, ClienteView, NovoCliente, OrdemClientes, ORDENS, Pendencia, TIPO_PESSOA, TipoPessoa,
} from '../../Models/cliente-model';
import {
  formatarDocumento, formatarTelefone, normalizar, soDigitos,
} from '../../Utils/cliente';

@Component({
  selector: 'app-clientes',
  imports: [
    Title, AddButton, ModalEdicao, ClientesTable, ClienteDetalhes,
    ReactiveFormsModule, NgTemplateOutlet,
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  private clientes = signal<Cliente[]>(CLIENTES);
  busca = signal('');
  ordem = signal<OrdemClientes>('nome-asc');

  readonly ordens = ORDENS;

  // Pendências = contas a receber ainda não recebidas, ligadas ao cliente pelo nome.
  // Com o backend, o vínculo passa a ser por id do cliente.
  private todos = computed<ClienteView[]>(() =>
    this.clientes().map((c): ClienteView => {
      const pendencias = CONTAS_RECEBER
        .filter((r) => r.cliente === c.nome && !r.recebido)
        .map((r): Pendencia => ({
          descricao: r.detalhe ?? 'Recebimento em aberto',
          vencimento: r.vencimento,
          valor: r.valor,
          atrasada: r.vencimento !== null && r.vencimento < HOJE,
        }));

      return {
        ...c,
        pendencias,
        emAberto: pendencias.reduce((total, p) => total + p.valor, 0),
        atrasado: pendencias.some((p) => p.atrasada),
      };
    }),
  );

  lista = computed(() => {
    const termo = normalizar(this.busca().trim());
    const nome = (a: ClienteView, b: ClienteView) => a.nome.localeCompare(b.nome, 'pt-BR');

    const ordenar: Record<OrdemClientes, (a: ClienteView, b: ClienteView) => number> = {
      'nome-asc': nome,
      'nome-desc': (a, b) => nome(b, a),
      'valor-desc': (a, b) => b.emAberto - a.emAberto || nome(a, b),
      'valor-asc': (a, b) => a.emAberto - b.emAberto || nome(a, b),
    };

    return this.todos()
      .filter((c) => !termo || normalizar(c.nome).includes(termo))
      .sort(ordenar[this.ordem()]);
  });

  adicionar(novo: NovoCliente) {
    const id = Math.max(0, ...this.clientes().map((c) => c.id)) + 1;
    this.clientes.update((lista) => [...lista, { ...novo, id }]);
    this.busca.set(''); // garante que o cliente novo apareça
  }

  atualizar(id: number, dados: NovoCliente) {
    this.clientes.update((lista) => lista.map((c) => (c.id === id ? { ...c, ...dados } : c)));
    this.busca.set(''); // garante que o cliente editado continue visível
  }

  // ---------- Formulário (criação e edição) ----------
  private fb = inject(FormBuilder);
  readonly tipoInfo = TIPO_PESSOA;
  readonly tipos: TipoPessoa[] = ['fisica', 'juridica'];

  // null = criando; com id = editando aquele cliente
  editandoId = signal<number | null>(null);

  erroDocumento = signal('');
  erroTelefone = signal('');

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.pattern(/\S/)]],
    tipo: ['fisica' as TipoPessoa, Validators.required],
    documento: ['', Validators.required],
    telefone: ['', Validators.required],
  });

  resetarForm() {
    this.editandoId.set(null);
    this.form.reset({ nome: '', tipo: 'fisica', documento: '', telefone: '' });
    this.erroDocumento.set('');
    this.erroTelefone.set('');
  }

  // Valida o formulário e devolve os dados limpos, ou null se houver erro.
  // `idAtual` é o cliente em edição: o documento dele não conta como duplicado.
  private validar(idAtual: number | null): NovoCliente | null {
    const f = this.form.getRawValue();
    const documento = soDigitos(f.documento);
    const telefone = soDigitos(f.telefone);
    const tamanho = f.tipo === 'fisica' ? 11 : 14;

    this.erroDocumento.set(
      documento.length !== tamanho
        ? `O ${TIPO_PESSOA[f.tipo].documento} deve ter ${tamanho} dígitos.`
        : this.clientes().some((c) => c.documento === documento && c.id !== idAtual)
          ? 'Já existe um cliente com este documento.'
          : '',
    );
    this.erroTelefone.set(
      telefone.length === 10 || telefone.length === 11 ? '' : 'Informe o telefone com DDD.',
    );

    if (this.form.controls.nome.invalid || this.erroDocumento() || this.erroTelefone()) {
      this.form.markAllAsTouched();
      return null;
    }

    return { nome: f.nome.trim(), tipo: f.tipo, documento, telefone };
  }

  salvar(modal: AddButton) {
    const novo = this.validar(null);
    if (!novo) return;

    this.adicionar(novo);
    modal.fechar();
  }

  editar(cliente: ClienteView, modal: ModalEdicao) {
    this.editandoId.set(cliente.id);
    this.erroDocumento.set('');
    this.erroTelefone.set('');
    this.form.reset({
      nome: cliente.nome,
      tipo: cliente.tipo,
      documento: formatarDocumento(cliente.documento, cliente.tipo),
      telefone: formatarTelefone(cliente.telefone),
    });
    modal.abrir();
  }

  salvarEdicao(modal: ModalEdicao) {
    const id = this.editandoId();
    if (id === null) return;

    const dados = this.validar(id);
    if (!dados) return;

    this.atualizar(id, dados);
    modal.fechar();
  }

  nomeInvalido(): boolean {
    const c = this.form.controls.nome;
    return c.invalid && c.touched;
  }
}