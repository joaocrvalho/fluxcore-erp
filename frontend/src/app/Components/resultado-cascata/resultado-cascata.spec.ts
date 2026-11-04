import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultadoCascata } from './resultado-cascata';

describe('ResultadoCascata', () => {
  let component: ResultadoCascata;
  let fixture: ComponentFixture<ResultadoCascata>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoCascata],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadoCascata);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
