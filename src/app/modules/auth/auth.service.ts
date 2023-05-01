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
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Key } from '../../shared/models/auth/key.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl: string;
  userProfile$ = new BehaviorSubject<UserProfile | null>(null);
  get userProfile(): Observable<UserProfile> {
    const localStorageUserProfile = localStorage.getItem(Key.UserProfile);
    if (localStorageUserProfile)
      return of(JSON.parse(localStorageUserProfile) as UserProfile);
    return this.getUserProfile();
  }

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) {
    this.apiUrl = environment.backendApiUrl;
  }

  login(data: Omit<User, 'id'>): void {
    this.http
      .post<Jwt>(this.apiUrl + '/auth/login', data)
      .subscribe((accessTokenInfo) => {
        this.saveToken(accessTokenInfo);
        this.getUserProfile().subscribe((userProfile) => {
          localStorage.setItem(Key.UserProfile, JSON.stringify(userProfile));
        });
      });
  }

  refresh(): void {
    this.http
      .get<Jwt>(this.apiUrl + '/auth/refresh')
      .subscribe((accessTokenInfo) => {
        this.saveToken(accessTokenInfo);
        this.getUserProfile().subscribe((userProfile) => {
          localStorage.setItem(Key.UserProfile, JSON.stringify(userProfile));
        });
      });
  }

  logout(): void {
    this.http.get<null>(this.apiUrl + '/auth/logout').subscribe(() => {
      localStorage.removeItem(Key.Token);
      localStorage.removeItem(Key.UserProfile);
      this.snackBarService.openSnackBar(
        'Has cerrado sesión',
        SnackBarTheme.Success
      );
    });
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl + '/auth/profile');
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
