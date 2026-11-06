import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
type Lancamento={id?:number;descricao:string;valor:number;tipo:'Entrada'|'Saída';data:string;categoria:string;status:string};
type Produto={id?:number;nome:string;sku:string;categoria:string;preco:number;quantidade:number;estoqueMinimo:number};
type Cliente={id?:number;nome:string;documento:string;email:string;telefone:string;tipo:string};
@Component({selector:'app-root',imports:[FormsModule,CurrencyPipe,DatePipe,NgTemplateOutlet],templateUrl:'./app.html',styleUrl:'./app.scss'})
export class App implements OnInit {
 private http=inject(HttpClient); private base=location.hostname==='localhost'||location.hostname==='127.0.0.1'?'http://localhost:8080/api':'/api';
 view='Dashboard'; aba='Pagar'; busca=''; modal=false; editando=false; carregando=false; erro=''; filtroAberto=false; tipoFiltro='Todos'; statusFiltro='Todos'; dataInicio=''; dataFim=''; pagina=1; porPagina=8;
 lancamentos:Lancamento[]=[]; produtos:Produto[]=[]; clientes:Cliente[]=[]; resumo={entradas:0,saidas:0,saldo:0,total:0};
 form:any={}; ngOnInit(){this.atualizar();}
 get filtrados(){let q=this.busca.toLowerCase();let tipo=this.view==='Vendas'||(this.view==='Financeiro'&&this.aba==='Receber')?'Entrada':this.view==='Compras'||(this.view==='Financeiro'&&this.aba==='Pagar')?'Saída':'';return this.lancamentos.filter(x=>(!tipo||x.tipo===tipo)&&`${x.descricao} ${x.categoria} ${x.status}`.toLowerCase().includes(q));}
 get fimPagina(){return Math.min(this.pagina*this.porPagina,this.filtrados.length)} get estoqueUnidades(){return this.produtos.reduce((a,p)=>a+p.quantidade,0)} get estoqueBaixo(){return this.produtos.filter(p=>p.quantidade<=p.estoqueMinimo).length} get valorEstoque(){return this.produtos.reduce((a,p)=>a+p.preco*p.quantidade,0)} get paginaItens(){return this.filtrados.slice((this.pagina-1)*this.porPagina,this.pagina*this.porPagina)} get totalPaginas(){return Math.max(1,Math.ceil(this.filtrados.length/this.porPagina))}
 atualizar(){this.http.get<Lancamento[]>(this.base+'/lancamentos').subscribe({next:v=>this.lancamentos=v,error:()=>this.erro='Não foi possível carregar lançamentos.'});this.http.get<typeof this.resumo>(this.base+'/lancamentos/resumo').subscribe({next:v=>this.resumo=v});this.carregarProdutos();this.carregarClientes();}
 carregarProdutos(){this.http.get<Produto[]>(this.base+'/produtos').subscribe({next:v=>this.produtos=v,error:()=>this.erro='Falha ao carregar estoque.'})} carregarClientes(){this.http.get<Cliente[]>(this.base+'/clientes').subscribe({next:v=>this.clientes=v,error:()=>this.erro='Falha ao carregar clientes.'})}
 novoLancamento():Lancamento{return {descricao:'',valor:0,tipo:'Entrada',data:new Date().toISOString().slice(0,10),categoria:'Vendas',status:'Pago'}}
 abrir(item?:any){this.editando=!!item;this.form=item?{...item}:this.view==='Estoque'?{nome:'',sku:'',categoria:'',preco:0,quantidade:0,estoqueMinimo:0}:this.view==='Clientes'?{nome:'',documento:'',email:'',telefone:'',tipo:'Pessoa física'}:{...this.novoLancamento(),tipo:(this.view==='Vendas'||(this.view==='Financeiro'&&this.aba==='Receber'))?'Entrada':'Saída'};this.modal=true;this.erro='';}
 salvar(){this.carregando=true;let endpoint=this.view==='Estoque'?'produtos':this.view==='Clientes'?'clientes':'lancamentos';let req=this.editando&&this.form.id?this.http.put(`${this.base}/${endpoint}/${this.form.id}`,this.form):this.http.post(`${this.base}/${endpoint}`,this.form);req.subscribe({next:()=>{this.modal=false;this.carregando=false;this.atualizar()},error:()=>{this.erro='Confira os campos e tente novamente.';this.carregando=false}})}
 excluir(item:any){let endpoint=this.view==='Estoque'?'produtos':this.view==='Clientes'?'clientes':'lancamentos';if(item.id&&confirm(`Excluir “${item.nome||item.descricao}”?`))this.http.delete(`${this.base}/${endpoint}/${item.id}`).subscribe({next:()=>this.atualizar(),error:()=>this.erro='Não foi possível excluir.'})}
 setView(v:string){this.view=v;this.busca='';this.pagina=1;this.erro='';if(v==='Vendas')this.aba='Receber';if(v==='Compras')this.aba='Pagar';}
 limparFiltros(){this.tipoFiltro='Todos';this.statusFiltro='Todos';this.dataInicio='';this.dataFim='';this.busca='';this.pagina=1;}
 mudarPagina(delta:number){this.pagina=Math.max(1,Math.min(this.totalPaginas,this.pagina+delta));}
}

