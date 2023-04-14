import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CatService } from '../../cat/cat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm?: FormGroup;
  error?: string;

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

  triggerCat(): void {
    this.catService.getRequest().subscribe((cats) => {
      console.log('cats: ', cats);
    });
  }
}
