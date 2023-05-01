import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CatService } from '../../cat/cat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm?: FormGroup;
  error?: string;
  private userProfileSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private catService: CatService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.userProfileSubscription = this.authService.userProfile$.subscribe(
      (userProfile) => {
        console.log('userProfile: ', userProfile);
      }
    );
    this.authService.initUserProfile();
  }

  login(): void {
    if (this.loginForm) {
      const values = this.loginForm.value;
      if (this.loginForm.valid)
        this.authService.login({
          username: values.username,
          password: values.password
        });
    }
  }

  logout(): void {
    this.authService.logout();
  }

  triggerCat(): void {
    this.catService.getRequest().subscribe((cats) => {
      console.log('cats: ', cats);
    });
  }

  triggerRefresh(): void {
    this.authService.refresh();
  }
}
