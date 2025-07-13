import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoAgendamentoComponent } from './edicao-agendamento.component';

describe('EdicaoAgendamentoComponent', () => {
  let component: EdicaoAgendamentoComponent;
  let fixture: ComponentFixture<EdicaoAgendamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoAgendamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicaoAgendamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
