import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataStateChangeEvent } from "../data-grid/interfaces/data-state-change-event";
import { Observable } from "rxjs";
import { GridDataResult } from "../data-grid/interfaces/grid-data-result";

@Injectable({ providedIn: 'root' })
export class OrderService {
    
    private apiUrl = 'https://api.example.com/odata/Orders';
    
    constructor(private http: HttpClient) {}
    getOrders(state: DataStateChangeEvent): Observable<GridDataResult> {
    // Bu method otomatik olarak OData query oluşturur
    // Component içinde zaten var ama custom backend için örnek:
    
    let url = `${this.apiUrl}?$count=true`;
    url += `&$top=${state.take}`;
    url += `&$skip=${state.skip}`;
    
    if (state.sort && state.sort.length > 0) {
      const orderBy = state.sort.map(s => `${s.field} ${s.dir}`).join(',');
      url += `&$orderby=${orderBy}`;
    }
    
    if (state.filter && state.filter.length > 0) {
      const filter = this.buildFilter(state.filter);
      url += `&$filter=${filter}`;
    }

    return this.http.get<GridDataResult>(url);
  }

  private buildFilter(filters: any[]): string {
    // Filter oluşturma mantığı component'te var
    return filters.map(f => `${f.field} ${f.operator} '${f.value}'`).join(' and ');
  }
}