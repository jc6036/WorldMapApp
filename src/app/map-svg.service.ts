import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MapSVGService {

  constructor(private http: HttpClient) {}

  getMap(): Observable<string> {
    return this.http.get('/assets/map-image.svg', { responseType: 'text' });
  }
}