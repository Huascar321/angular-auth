import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Cat } from '@shared/index';

@Injectable({
  providedIn: 'root'
})
export class CatService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.backendApiUrl;
  }

  getRequest(): Observable<Cat[]> {
    return this.http.get<Cat[]>(this.apiUrl + '/cats');
  }
}
