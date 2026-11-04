import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesTable } from './clientes-table';

describe('ClientesTable', () => {
  let component: ClientesTable;
  let fixture: ComponentFixture<ClientesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
