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
import { AtendimentoComponent } from './atendimento/atendimento.component';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { authGuard } from './core/guards/auth.guard';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
import { RegisterComponent } from './equipe-caps/equipe-caps.component';
import { AnamneseInfantilComponent } from './anamnese-infantil/anamnese-infantil.component';
import { RaasComponent } from './raas/raas.component';
import { EvolucaoComponent } from './evolucao/evolucao.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Rota pública
  {
    path: 'login',
    component: LoginComponent
  },

  // Rotas protegidas
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },
  {
    path: 'pacientes',
    component: PacientesComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },
  {
    path: 'pacientes/cadastro',
    component: CadastroPacienteComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },
  {
    path: 'pacientes/editar/:id',
    component: EdicaoPacienteComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },
  {
    path: 'agendamentos',
    component: AgendamentosComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },
  {
    path: 'agendamentos/novo',
    component: CadastroAgendamentoComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },
  {
    path: 'agendamentos/editar/:id',
    component: EdicaoAgendamentoComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },
  {
    path: 'atendimento',
    component: AtendimentoComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },
  {
    path: 'configuracoes',
    component: ConfiguracoesComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },
  {
    path: 'auditoria',
    component: AuditoriaComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },
  {
    path: 'anamnese-infantil',
    component: AnamneseInfantilComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },
  {
    path: 'raas',
    component: RaasComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },  
  {
    path: 'evolucao',
    component: EvolucaoComponent,
    canActivate: [authGuard],
    canMatch: [authGuard]
  },

  // Wildcard → redireciona
  {
    path: '**',
    redirectTo: 'login'
  }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideRouter(routes),
    provideNgxMask()
  ],
};
