import { TemplateRef } from "@angular/core";
import { Observable } from "rxjs";

export interface GridColumn {
  field: string;
  header?: string; // Optional - auto-generated from field if not provided
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  visible?: boolean;
  locked?: boolean; // Column cannot be moved
  pinned?: 'left' | 'right'; // Pin column to left or right
  groupable?: boolean; // Can be used for grouping
  editable?: boolean; // Inline editing enabled
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
  filterType?: 'text' | 'select' | 'multiselect' | 'date' | 'number' | 'boolean';
  filterOperator?: 'eq' | 'contains' | 'startswith' | 'endswith' | 'lt' | 'lte' | 'gt' | 'gte' | 'between'; // Default filter operator
  filterValues?: any[]; // Static filter values
  filterValuesFn?: () => Observable<any[]>; // Dynamic filter values
  template?: TemplateRef<any>; // Custom cell template
  headerTemplate?: TemplateRef<any>; // Custom header template
  editTemplate?: TemplateRef<any>; // Custom edit template
  format?: (value: any) => string; // Value formatting
  aggregate?: 'sum' | 'avg' | 'count' | 'min' | 'max'; // Summary row aggregate
  groupAggregate?: 'sum' | 'avg' | 'count' | 'min' | 'max'; // Group aggregate
  cellClass?: string | ((row: any) => string); // CSS class for cell
  cellStyle?: (row: any) => { [key: string]: string }; // Inline styles for cell
  cellTemplate?: (value: any, row: any) => string; // Custom HTML renderer for cell
  headerClass?: string; // CSS class for header
  footerTemplate?: TemplateRef<any>; // Custom footer template
  footerValue?: string | ((data: any[]) => string); // Custom footer value/calculation
  sortOrder?: number; // Sort priority (for multi-sort)
  
  // YENİ ÖZELLIKLER:
  showIndex?: boolean; // True ise, field datasından değil satır numarasını (index) gösterir
  valueGetter?: (row: any, index: number) => any; // Custom value getter - veriyi dönüştürmeden önce manipüle et
  headerContent?: string | ((column: GridColumn) => string); // Header için özel içerik (HTML destekli)
}