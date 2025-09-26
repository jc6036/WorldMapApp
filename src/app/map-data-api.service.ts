import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MapDataAPIService {
  private targetURL: string = "https://api.worldbank.org/v2/country/";

  constructor(private http: HttpClient) {
  }

  getCountryData(countryID: string): Observable<string> {
    return this.http.get(this.targetURL+countryID, { responseType: 'text' });    
  }
}