import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImpostosConfig } from './impostos-config';

describe('ImpostosConfig', () => {
  let component: ImpostosConfig;
  let fixture: ComponentFixture<ImpostosConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpostosConfig],
    }).compileComponents();

    fixture = TestBed.createComponent(ImpostosConfig);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
