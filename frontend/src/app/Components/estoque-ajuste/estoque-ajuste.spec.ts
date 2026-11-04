import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstoqueAjuste } from './estoque-ajuste';

describe('EstoqueAjuste', () => {
  let component: EstoqueAjuste;
  let fixture: ComponentFixture<EstoqueAjuste>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstoqueAjuste],
    }).compileComponents();

    fixture = TestBed.createComponent(EstoqueAjuste);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
