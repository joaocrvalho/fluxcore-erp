import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultadoResumo } from './resultado-resumo';

describe('ResultadoResumo', () => {
  let component: ResultadoResumo;
  let fixture: ComponentFixture<ResultadoResumo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoResumo],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadoResumo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
