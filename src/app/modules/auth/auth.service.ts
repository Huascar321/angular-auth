import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Jwt } from '../../shared/models/auth/jwt.model';
import * as dayjs from 'dayjs';
import { parseTimeToSeconds } from '../../core/helper/parser.helper';
import type { User } from '@shared/index';
import { SnackBarService } from '../../core/services/snackbar.service';
import { SnackBarTheme } from '../../shared/models/snackbar.model';
import { UserProfile } from '../../shared/models/auth/user-profile.model';
import { BehaviorSubject, tap } from 'rxjs';
import { Key } from '../../shared/models/auth/key.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl: string;
  userProfile$ = new BehaviorSubject<UserProfile | null>(null);

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) {
    this.apiUrl = environment.backendApiUrl;
  }

  initUserProfile(): void {
    const localStorageUserProfile = localStorage.getItem(Key.UserProfile);
    if (localStorageUserProfile) {
      const userProfile = JSON.parse(localStorageUserProfile) as UserProfile;
      this.userProfile$.next(userProfile);
    } else {
      this.setUserProfile();
    }
  }

  login(data: Omit<User, 'id'>): void {
    this.http
      .post<Jwt>(this.apiUrl + '/auth/login', data)
      .subscribe((accessTokenInfo) => {
        this.saveToken(accessTokenInfo);
        this.setUserProfile();
      });
  }

  refresh(): void {
    this.http
      .get<Jwt>(this.apiUrl + '/auth/refresh')
      .subscribe((accessTokenInfo) => {
        this.saveToken(accessTokenInfo);
        this.setUserProfile();
      });
  }

  logout(): void {
    this.http.get<null>(this.apiUrl + '/auth/logout').subscribe(() => {
      localStorage.removeItem(Key.Token);
      localStorage.removeItem(Key.UserProfile);
      this.userProfile$.next(null);
      this.snackBarService.openSnackBar(
        'Has cerrado la sesión',
        SnackBarTheme.Success
      );
    });
  }

  setUserProfile(): void {
    this.http
      .get<UserProfile>(this.apiUrl + '/auth/profile')
      .pipe(
        tap((userProfile) => {
          this.userProfile$.next(userProfile);
          localStorage.setItem(Key.UserProfile, JSON.stringify(userProfile));
        })
      )
      .subscribe();
  }

  getAccessToken(): string | null {
    const item = localStorage.getItem(Key.Token);
    if (!item) return null;
    const token = JSON.parse(item);
    const expiresAt = dayjs(token.expires_at);
    if (dayjs().isAfter(expiresAt)) {
      localStorage.removeItem(Key.Token);
      localStorage.removeItem(Key.UserProfile);
      return null;
    }
    return token.access_token;
  }

  saveToken(token: Jwt): void {
    const expiresInSeconds = parseTimeToSeconds(token.access_token_expires_in);
    const expiresAt = dayjs().add(expiresInSeconds, 'second');
    localStorage.setItem(
      Key.Token,
      JSON.stringify({
        access_token: token.access_token,
        expires_at: expiresAt.toISOString()
      })
    );
  }
}
