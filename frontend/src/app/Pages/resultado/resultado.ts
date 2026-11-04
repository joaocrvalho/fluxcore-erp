import { Component, computed, signal } from '@angular/core';
import { DespesasFixas } from '../../Components/despasas-fixas/despesas-fixas';
import { ImpostosConfig } from '../../Components/impostos-config/impostos-config';
import { ResultadoCascata } from '../../Components/resultado-cascata/resultado-cascata';
import { ResultadoResumo } from '../../Components/resultado-resumo/resultado-resumo';
import { Title } from '../../Components/title/title';
import {
  DESPESAS_FIXAS, IMPOSTOS_CONFIG, MES_INICIAL, MESES_RESULTADO,
} from '../../Mocks/resultado-mock';
import { ResultadoMes } from '../../Models/resultado-model';
import { calcularEtapas, lucroLiquido } from '../../Utils/resultado';

@Component({
  selector: 'app-resultado',
  imports: [Title, ResultadoResumo, ResultadoCascata, DespesasFixas, ImpostosConfig],
  templateUrl: './resultado.html',
  styleUrl: './resultado.css',
})
export class Resultado {
  readonly meses = MESES_RESULTADO;
  readonly fixas = DESPESAS_FIXAS;
  readonly impostosConfig = IMPOSTOS_CONFIG;

  mesId = signal(MES_INICIAL);

  mesAtual = computed(() => this.meses.find((m) => m.id === this.mesId()) ?? this.meses[0]);
  etapas = computed(() => calcularEtapas(this.mesAtual(), this.fixas));

  receita = computed(() => this.etapas()[0].valor);
  resultado = computed(() => lucroLiquido(this.etapas()));
  totalImpostos = computed(() => this.etapas().find((e) => e.id === 'impostos')?.valor ?? 0);

  // Variação do lucro em relação ao mês anterior da lista (null se não houver)
  variacao = computed<number | null>(() => {
    const i = this.meses.findIndex((m) => m.id === this.mesAtual().id);
    if (i <= 0) return null;

    const anterior = this.lucro(this.meses[i - 1]);
    if (anterior === 0) return null;
    return ((this.resultado() - anterior) / Math.abs(anterior)) * 100;
  });

  private lucro(mes: ResultadoMes): number {
    return lucroLiquido(calcularEtapas(mes, this.fixas));
  }
}