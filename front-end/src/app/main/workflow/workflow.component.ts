import { ErrorComponent } from './../../dialogs/error/error.component';
import { WorkflowService } from './../../services/workflow.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent implements OnInit {
  responsables: any[] = [];
  employees: any[] = [];
  selectors: any[] = [];
  isLoading: boolean = false;

  constructor(private service: WorkflowService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.service.getUsers().subscribe(
      (users) => {
        this.isLoading = false;
        this.employees = users.employees as any[];
        const responsables = users.responsables as any[];
        responsables.forEach((element) => {
          const index = this.responsables.findIndex(
            (value) => value.resp_id === element.resp_id
          );
          let responsable = null,
            employee = null;

          if (element.emp_id) {
            employee = {
              emp_id: element.emp_id,
              emp_fname: element.emp_fname,
              emp_lname: element.emp_lname,
              emp_login: element.emp_login,
              emp_role: element.emp_role,
            };
          }

          if (index === -1) {
            responsable = {
              resp_id: element.resp_id,
              resp_fname: element.resp_fname,
              resp_lname: element.resp_lname,
              resp_login: element.resp_login,
              resp_role: element.resp_role,
              responseTo: [].constructor(),
            };
            if (employee) responsable.responseTo.push(employee);
            this.responsables.push(responsable);
            this.selectors.push({
              responsable: element.resp_id,
              responseTo: null,
            });
          } else {
            if (employee) this.responsables[index].responseTo.push(employee);
          }
        });
      },
      (err) => (this.isLoading = false)
    );
  }

  addWorkflow(index: any) {
    const body = this.selectors[index];
    if (body.responseTo) {
      this.service.addWorkflow(body).subscribe((res: any) => {
        if (res.err) {
          if (res.err === 'WORKFLOW_EXIST')
            this.openError('workflow deja exist');
          else {
            this.openError('erreur dans le serveur');
            console.log(res.err);
          }
        } else {
          const employee = {
            emp_id: res.user_id,
            emp_fname: res.fname,
            emp_lname: res.lname,
            emp_login: res.login,
            emp_role: res.role,
          };
          this.responsables[index].responseTo.push(employee);
          this.selectors[index].responseTo = null;
        }
      });
    }
  }

  deleteWorkflow(resp: any, emp: any, i: any, j: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '350px',
      data: {
        title: 'supprimer workflow',
        message: `voulez-vous vraiment supprimer cet utilisateur (${emp.emp_fname} ${emp.emp_lname}) from workflow ?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.service
          .deleteWorkflow(resp.resp_id, emp.emp_id)
          .subscribe((res) => {
            if (res === 1) {
              this.responsables[i].responseTo.splice(j, 1);
            }
          });
      }
    });
  }

  openError(message: any) {
    const dialogRef = this.dialog.open(ErrorComponent, {
      width: '350px',
      data: {
        title: 'erreur',
        message: message,
      },
      panelClass: 'error-popup',
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
