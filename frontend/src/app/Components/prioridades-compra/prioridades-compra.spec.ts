import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrioridadesCompra } from './prioridades-compra';

describe('PrioridadesCompra', () => {
  let component: PrioridadesCompra;
  let fixture: ComponentFixture<PrioridadesCompra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrioridadesCompra],
    }).compileComponents();

    fixture = TestBed.createComponent(PrioridadesCompra);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
