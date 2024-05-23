import { ErrorComponent } from './../../dialogs/error/error.component';
import { UpdateUserComponent } from './../../dialogs/update-user/update-user.component';
import { AddUserComponent } from './../../dialogs/add-user/add-user.component';
import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';

@Component({
  selector: 'app-gerer-users',
  templateUrl: './gerer-users.component.html',
  styleUrls: ['./gerer-users.component.scss'],
})
export class GererUsersComponent implements OnInit {
  users: any;
  isLoading: boolean = false;

  constructor(private service: UsersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.service.getAllUsers().subscribe(
      (res: any) => {
        this.isLoading = false;
        if (!res.err) {
          this.users = res;
        }
      },
      (err) => (this.isLoading = false)
    );
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((user) => {
      if (user && user.err) {
        if (user.err === 'USERNAME_EXIST') {
          this.openError('nom utlisateur deja exist');
        } else {
          this.openError('erreur dans le serveur');
          console.log(user.err);
        }
      } else if (user) {
        this.users.push(user);
      }
    });
  }

  openUpdateDialog(user: any): void {
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width: '350px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((user) => {
      if (user && user.err) {
        if (user.err === 'USERNAME_EXIST') {
          this.openError('nom utlisateur deja exist');
        } else {
          this.openError('erreur dans le serveur');
          console.log(user.err);
        }
      } else if (user) {
        let index = this.users.findIndex(
          (item: any) => item.user_id === user.user_id
        );
        this.users.splice(index, 1, user);
      }
    });
  }

  deleteUser(user: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '350px',
      data: {
        title: 'supprimer utilisateur',
        message: `voulez-vous vraiment supprimer cet utilisateur (${user.fname} ${user.lname}) ?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.service.deleteUser(user.user_id).subscribe((res: any) => {
          if (res === 1) {
            let index = this.users.findIndex(
              (item: any) => item.user_id === user.user_id
            );
            this.users.splice(index, 1);
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
