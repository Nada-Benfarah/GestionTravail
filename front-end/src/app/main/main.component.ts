import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  user: any;
  destroy$: Subject<any>;

  constructor(private gs: GlobalService) {
    this.destroy$ = new Subject<any>();
  }

  ngOnInit(): void {
    this.gs.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

    this.destroy$.next(true);
    this.destroy$.complete();
  }

  logout() {
    this.gs.logOut();
  }
}
