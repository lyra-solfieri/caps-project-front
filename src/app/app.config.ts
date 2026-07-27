import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PacientesComponent } from './pacientes/listar/pacientes.component';
import { CadastroPacienteComponent } from './pacientes/cadastro-paciente/cadastro-paciente.component';
import { EdicaoPacienteComponent } from './pacientes/edicao-paciente/edicao-paciente.component';
import { AgendamentosComponent } from './agendamentos/listar/agendamentos.component';
import { CadastroAgendamentoComponent } from './agendamentos/cadastro-agendamento/cadastro-agendamento.component';
import { EdicaoAgendamentoComponent } from './agendamentos/edicao-agendamento/edicao-agendamento.component';
import { AtendimentoComponent } from './atendimento/atendimento.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/admin.guard';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
import { RegisterComponent } from './equipe-caps/equipe-caps.component';
import { AnamneseInfantilComponent } from './anamnese-infantil/anamnese-infantil.component';
import { RaasComponent } from './raas/form/raas.component';
import { EvolucaoComponent } from './evolucao/evolucao.component';
import { CadastroAnamneseComponent } from './anamnese-infantil/cadastrar/anamnese-infantil-cadastro.component';
import { EdicaoAnamneseComponent } from './anamnese-infantil/editar/anamnese-infantil-editar.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { RaasListarComponent } from './raas/listar/listar.component';
import { PerfilComponent } from './perfil/perfil.component';

const adminRole = roleGuard(['ADMIN']);
const clinicalRole = roleGuard(['ADMIN', 'MODERATOR', 'EDITOR']);

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
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },
  {
    path: 'pacientes/cadastro',
    component: CadastroPacienteComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },
  {
    path: 'pacientes/editar/:id',
    component: EdicaoPacienteComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },
  {
    path: 'agendamentos',
    component: AgendamentosComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },
  {
    path: 'agendamentos/novo',
    component: CadastroAgendamentoComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },
  {
    path: 'agendamentos/editar/:id',
    component: EdicaoAgendamentoComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },
  {
    path: 'atendimento',
    component: AtendimentoComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
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
    canActivate: [authGuard, adminRole],
    canMatch: [authGuard, adminRole]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authGuard, adminRole],
    canMatch: [authGuard, adminRole]
  },
  {
    path: 'anamnese-infantil',
    component: AnamneseInfantilComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },
  {
    path: 'anamnese-infantil/cadastrar',
    component: CadastroAnamneseComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },
  {
    path: 'anamnese-infantil/editar/:id',
    component: EdicaoAnamneseComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },

  {
    path: 'raas',
    component: RaasListarComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },
  {
    path: 'raas/novo',
    component: RaasComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },
  {
    path: 'raas/editar/:id',
    component: RaasComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },
  {
    path: 'raas/novo/:id',
    component: RaasComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },
  {
    path: 'evolucao',
    component: EvolucaoComponent,
    canActivate: [authGuard, clinicalRole],
    canMatch: [authGuard, clinicalRole]
  },


  {
    path: 'perfil',
    component: PerfilComponent,
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
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    provideRouter(routes),
    provideNgxMask(),
    provideCharts(withDefaultRegisterables())
  ],
};
