import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Jwt } from '../../shared/models/auth/jwt.model';
import * as dayjs from 'dayjs';
import { parseTimeToSeconds } from '../../core/helper/parser.helper';
import type { User } from '@shared/index';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl: string;
  private readonly TOKEN_KEY = 'access_token_info';
  constructor(private http: HttpClient) {
    this.apiUrl = environment.backendApiUrl;
  }

  login(data: Omit<User, 'id'>): void {
    this.http
      .post<Jwt>(this.apiUrl + '/auth/login', data)
      .subscribe((accessTokenInfo) => {
        this.saveToken(accessTokenInfo);
      });
  }

  getAccessToken(): string | null {
    const item = localStorage.getItem(this.TOKEN_KEY);
    if (!item) return null;
    const token = JSON.parse(item);
    const expiresAt = dayjs(token.expires_at);
    if (dayjs().isAfter(expiresAt)) {
      localStorage.removeItem(this.TOKEN_KEY);
      return null;
    }
    return token.access_token;
  }

  saveToken(token: Jwt): void {
    const expiresInSeconds = parseTimeToSeconds(token.access_token_expires_in);
    const expiresAt = dayjs().add(expiresInSeconds, 'second');
    localStorage.setItem(
      this.TOKEN_KEY,
      JSON.stringify({
        access_token: token.access_token,
        expires_at: expiresAt.toISOString()
      })
    );
  }
}
