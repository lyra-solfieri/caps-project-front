import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PacientesComponent } from './pacientes/listar/pacientes.component';
import { CadastroPacienteComponent } from './pacientes/cadastro-paciente/cadastro-paciente.component';
import { EdicaoPacienteComponent } from './pacientes/edicao-paciente/edicao-paciente.component';
import { AgendamentosComponent } from './agendamentos/listar/agendamentos.component';
import { CadastroAgendamentoComponent } from './agendamentos/cadastro-agendamento/cadastro-agendamento.component';
import { EdicaoAgendamentoComponent } from './agendamentos/edicao-agendamento/edicao-agendamento.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AtendimentoComponent } from './atendimento/atendimento.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'pacientes', component: PacientesComponent },
  { path: 'pacientes/cadastro', component: CadastroPacienteComponent },
  { path: 'pacientes/editar/:id', component: EdicaoPacienteComponent},
  { path: 'agendamentos', component: AgendamentosComponent},
  { path: 'agendamentos/novo', component: CadastroAgendamentoComponent},
  { path: 'agendamentos/editar/:id', component: EdicaoAgendamentoComponent},
  { path: '**', redirectTo: 'login' },
  { path: 'atendimento', component: AtendimentoComponent}
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    provideRouter(routes)
  ],
};
