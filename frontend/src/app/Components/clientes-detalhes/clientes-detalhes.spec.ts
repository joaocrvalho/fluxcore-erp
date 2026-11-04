import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesDetalhes } from './clientes-detalhes';

describe('ClientesDetalhes', () => {
  let component: ClientesDetalhes;
  let fixture: ComponentFixture<ClientesDetalhes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesDetalhes],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesDetalhes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
