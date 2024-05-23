import { FileModule } from './../dialogs/file/file.module';
import { ErrorModule } from './../dialogs/error/error.module';
import { ResponsableGuard } from './../guards/responsable.guard';
import { EvaluationModule } from './../dialogs/evaluation/evaluation.module';
import { FormsModule } from '@angular/forms';
import { UpdateUserModule } from './../dialogs/update-user/update-user.module';
import { ConfirmModule } from './../dialogs/confirm/confirm.module';
import { GererDemandesComponent } from './gerer-demandes/gerer-demandes.component';
import { GererUsersComponent } from './gerer-users/gerer-users.component';
import { AdminGuard } from './../guards/admin.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { ImportsModule } from '../imports.module';
import { SideNavComponent } from './side-nav/side-nav.component';
import { AddUserModule } from '../dialogs/add-user/add-user.module';
import { SettingsComponent } from './settings/settings.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { UserGuard } from '../guards/user.guard';
import { DemandeComponent } from './demande/demande.component';
import { LoadingComponent } from './loading/loading.component';
import { ConsultComponent } from './consult/consult.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'users',
        component: GererUsersComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'demandes',
        component: GererDemandesComponent,
        canActivate: [ResponsableGuard],
      },
      {
        path: 'consult',
        component: ConsultComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [UserGuard],
      },
      {
        path: 'workflow',
        component: WorkflowComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'demande',
        component: DemandeComponent,
        canActivate: [UserGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    MainComponent,
    SideNavComponent,
    GererUsersComponent,
    GererDemandesComponent,
    SettingsComponent,
    WorkflowComponent,
    DemandeComponent,
    LoadingComponent,
    ConsultComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ImportsModule,
    AddUserModule,
    UpdateUserModule,
    ConfirmModule,
    EvaluationModule,
    ErrorModule,
    FileModule,
    RouterModule.forChild(routes),
  ],
})
export class MainModule {}
