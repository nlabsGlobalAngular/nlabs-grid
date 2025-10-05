import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { GridDataResult } from './interfaces/grid-data-result';
import { GridColumn } from './interfaces/grid-column';
import { GridConfig } from './interfaces/grid-config';
import { DataStateChangeEvent } from './interfaces/data-state-change-event';
import { FilterDescriptor } from './interfaces/filter-descriptor';
import { SortDescriptor } from './interfaces/short-operator';
import { GroupDescriptor } from './interfaces/group-descriptor';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GridCellTemplateDirective } from './directives/grid-cell-template.directive';
import { GridFooterTemplateDirective } from './directives/grid-footer-template.directive';

@Component({
  selector: 'app-data-grid',
  imports: [CommonModule, FormsModule],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.css'
})
export class DataGrid implements OnInit, OnChanges, AfterContentInit {
  @Input() data: any[] | Observable<GridDataResult> = [];
  @Input() columns: GridColumn[] = [];
  @Input() theme: 'light' | 'dark' | 'auto' = 'auto'; // Theme input
  @Input() width: string = '100%'; // Grid width (e.g., '100%', '1200px', '80vw')
  @Input() maxWidth: string = '100%'; // Grid max-width (e.g., '1400px', '90%')
  @Input() showAddButton: boolean = false; // Show add button in toolbar
  @Input() showThemeToggle: boolean = true; // Show/hide theme toggle button
  @Input() config: GridConfig = {
    pageable: true,
    pageSize: 25,
    pageSizes: [10, 25, 50, 100],
    sortable: true,
    filterable: true,
    groupable: true,
    exportable: true,
    selectable: false,
    multiSelect: false,
    showSummary: true,
    columnMenu: true,
    resizable: true,
    reorderable: true,
    serverSide: false
  };

  @Output() dataStateChange = new EventEmitter<DataStateChangeEvent>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<void>(); // Add button clicked
  @Output() onSelectionChange = new EventEmitter<any[]>();

  // Content Templates
  @ContentChildren(GridCellTemplateDirective) cellTemplates!: QueryList<GridCellTemplateDirective>;
  @ContentChildren(GridFooterTemplateDirective) footerTemplates!: QueryList<GridFooterTemplateDirective>;

  private cellTemplateMap = new Map<string, GridCellTemplateDirective>();
  private footerTemplateMap = new Map<string, GridFooterTemplateDirective>();

  private dataState$ = new BehaviorSubject<DataStateChangeEvent>({
    skip: 0,
    take: 25,
    sort: [],
    filter: [],
    group: []
  });

  displayData: any[] = [];
  totalRecords = 0;
  loading = false;

  // Column State
  visibleColumns: GridColumn[] = [];
  allColumns: GridColumn[] = [];
  columnMenuVisible = false;
  exportMenuVisible = false;

  // Filter State
  filterDescriptors: FilterDescriptor[] = [];
  showFilterModal = false;
  currentFilterColumn: GridColumn | null = null;
  filterSearchTerm = '';
  filterSearchTerm2 = '';
  currentFilterOperator = 'contains';
  selectedFilterValues: Set<any> = new Set();
  availableFilterValues: any[] = [];

  // Inline Search State
  columnSearchTerms: { [key: string]: string } = {};
  columnSearchFilters: FilterDescriptor[] = [];

  // Sort State
  sortDescriptors: SortDescriptor[] = [];

  // Group State
  groupDescriptors: GroupDescriptor[] = [];

  // Selection State
  selectedRows: Set<any> = new Set();

  // Modal State
  showModal = false;
  modalType: 'edit' | 'delete' | 'add' | null = null;
  modalData: any = null;

  // Pagination
  currentPage = 1;
  pageSize = 25;

  // Column Resize
  resizingColumn: GridColumn | null = null;
  resizeStartX = 0;
  resizeStartWidth = 0;

  // Column Reorder
  draggedColumn: GridColumn | null = null;
  dragOverColumn: GridColumn | null = null;

  // Theme
  currentTheme: 'light' | 'dark' = 'light';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngAfterContentInit() {
    // Map cell templates by field
    this.cellTemplates.forEach(template => {
      this.cellTemplateMap.set(template.field, template);
    });

    // Map footer templates by field
    this.footerTemplates.forEach(template => {
      this.footerTemplateMap.set(template.field, template);
    });

    // Apply templates to columns
    this.applyContentTemplates();
  }

  applyContentTemplates() {
    // Auto-add actions column if actions template is provided
    const hasActionsTemplate = this.cellTemplateMap.has('actions');
    const hasActionsColumn = this.columns.some(col => col.field === 'actions');
    
    if (hasActionsTemplate && !hasActionsColumn) {
      // Automatically add actions column
      const actionsTemplate = this.cellTemplateMap.get('actions');
      this.columns.push({
        field: 'actions',
        header: 'Actions',
        sortable: false,
        filterable: false,
        width: '120px',
        type: 'custom',
        template: actionsTemplate?.template
      });
      
      // Re-initialize columns with the new actions column
      this.initializeColumns();
    }

    // Apply templates to all columns
    this.columns.forEach(column => {
      // Apply cell template if exists
      const cellTemplate = this.cellTemplateMap.get(column.field);
      if (cellTemplate) {
        column.template = cellTemplate.template;
      }

      // Apply footer template if exists
      const footerTemplate = this.footerTemplateMap.get(column.field);
      if (footerTemplate) {
        column.footerTemplate = footerTemplate.template;
      }
    });
  }

  ngOnInit() {
    console.log('Grid ngOnInit - Data:', this.data, 'Columns:', this.columns);
    this.pageSize = this.config.pageSize || 25;
    this.detectTheme();
    this.initializeColumns();
    this.subscribeToDataState();
    this.loadData(); // Initial data load
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns'] && !changes['columns'].firstChange) {
      this.initializeColumns();
    }
    if (changes['data'] && !changes['data'].firstChange) {
      this.loadData();
    }
    if (changes['theme']) {
      this.detectTheme();
    }
  }

  initializeColumns() {
    this.allColumns = this.columns.map(col => ({
      ...col,
      // Auto-generate header from field if not provided
      header: col.header || this.generateHeaderFromField(col.field),
      visible: col.visible !== false,
      sortable: col.sortable !== false,
      filterable: col.filterable !== false
    }));
    this.updateVisibleColumns();
  }

  // Generate human-readable header from field name
  private generateHeaderFromField(field: string): string {
    // Convert camelCase or snake_case to Title Case
    return field
      .replace(/([A-Z])/g, ' $1') // camelCase -> camel Case
      .replace(/_/g, ' ')          // snake_case -> snake case
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  }

  updateVisibleColumns() {
    this.visibleColumns = this.allColumns.filter(col => col.visible);
  }

  toggleColumnVisibility(column: GridColumn) {
    column.visible = !column.visible;
    this.updateVisibleColumns();
  }

  toggleColumnMenu() {
    this.columnMenuVisible = !this.columnMenuVisible;
  }

  toggleExportMenu() {
    this.exportMenuVisible = !this.exportMenuVisible;
  }

  showAllColumns() {
    this.allColumns.forEach(col => col.visible = true);
    this.updateVisibleColumns();
  }

  hideAllColumns() {
    this.allColumns.forEach((col, index) => {
      if (index > 0) col.visible = false; // İlk kolonu sakla
    });
    this.updateVisibleColumns();
  }

  onColumnDragStart(event: DragEvent, column: GridColumn) {
    if (column.locked) return;
    this.draggedColumn = column;
    event.dataTransfer!.effectAllowed = 'move';
  }

  onColumnDragOver(event: DragEvent, column: GridColumn) {
    if (!this.draggedColumn || column.locked) return;
    event.preventDefault();
    this.dragOverColumn = column;
  }

  onColumnDrop(event: DragEvent, targetColumn: GridColumn) {
    event.preventDefault();
    if (!this.draggedColumn || targetColumn.locked) return;

    const draggedIndex = this.visibleColumns.indexOf(this.draggedColumn);
    const targetIndex = this.visibleColumns.indexOf(targetColumn);

    if (draggedIndex !== targetIndex) {
      const allDraggedIndex = this.allColumns.indexOf(this.draggedColumn);
      const allTargetIndex = this.allColumns.indexOf(targetColumn);

      // Reorder in allColumns
      this.allColumns.splice(allDraggedIndex, 1);
      this.allColumns.splice(allTargetIndex, 0, this.draggedColumn);

      this.updateVisibleColumns();
    }

    this.draggedColumn = null;
    this.dragOverColumn = null;
  }

  onResizeStart(event: MouseEvent, column: GridColumn) {
    if (!this.config.resizable) return;
    
    this.resizingColumn = column;
    this.resizeStartX = event.pageX;
    
    const headerElement = (event.target as HTMLElement).closest('th') as HTMLElement;
    this.resizeStartWidth = headerElement.offsetWidth;

    event.preventDefault();
  }

  onResizeMove = (event: MouseEvent) => {
    if (!this.resizingColumn) return;

    const diff = event.pageX - this.resizeStartX;
    const newWidth = Math.max(50, this.resizeStartWidth + diff);
    this.resizingColumn.width = `${newWidth}px`;
  }

  onResizeEnd = () => {
    if (this.resizingColumn) {
      this.resizingColumn = null;
    }
  }

  subscribeToDataState() {
    this.dataState$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(state => {
        this.loadData();
        this.dataStateChange.emit(state);
      });
  }

  loadData() {
    this.loading = true;

    if (this.config.serverSide) {
      this.loadServerData();
    } else {
      this.loadClientData();
    }
  }

  loadClientData() {
    let data = Array.isArray(this.data) ? [...this.data] : [];
    console.log('loadClientData - Initial data:', data.length, 'items');

    // Apply global search first (searches across all columns with OR logic)
    if (this.globalSearchTerm && this.globalSearchTerm.trim()) {
      console.log('Applying global search:', this.globalSearchTerm);
      data = this.applyGlobalSearch(data, this.globalSearchTerm.trim());
      console.log('After global search:', data.length, 'items');
    }

    // Apply filters (combine regular filters with column search filters)
    const allFilters = [...this.filterDescriptors, ...this.columnSearchFilters];
    if (allFilters.length > 0) {
      console.log('Applying filters:', allFilters);
      data = this.applyFiltersToData(data, allFilters);
      console.log('After filters:', data.length, 'items');
    }

    // Apply sorting
    if (this.sortDescriptors.length > 0) {
      data = this.applyClientSort(data);
    }

    this.totalRecords = data.length;

    // Apply pagination
    const state = this.dataState$.value;
    this.displayData = data.slice(state.skip, state.skip + state.take);
    
    console.log('loadClientData - Display data:', this.displayData.length, 'Total:', this.totalRecords);
    this.loading = false;
  }

  loadServerData() {
    if (this.config.oDataUrl) {
      this.loadODataData();
    } else if (this.data instanceof Observable) {
      this.data.subscribe(result => {
        this.displayData = result.data;
        this.totalRecords = result.total;
        this.loading = false;
      });
    }
  }

  loadODataData() {
    const params = this.buildODataParams();
    
    this.http.get<any>(this.config.oDataUrl!, { params })
      .subscribe(response => {
        // OData v4
        if (response.value) {
          this.displayData = response.value;
          this.totalRecords = response['@odata.count'] || response.value.length;
        } 
        // OData v3
        else if (response.d) {
          this.displayData = response.d.results || response.d;
          this.totalRecords = response.d.__count || this.displayData.length;
        }
        
        this.loading = false;
      });
  }

  buildODataParams(): HttpParams {
    let params = new HttpParams();
    const state = this.dataState$.value;

    // $top and $skip
    params = params.set('$top', state.take.toString());
    params = params.set('$skip', state.skip.toString());
    params = params.set('$count', 'true');

    // $orderby
    if (state.sort && state.sort.length > 0) {
      const orderBy = state.sort
        .map(s => `${s.field} ${s.dir}`)
        .join(',');
      params = params.set('$orderby', orderBy);
    }

    // $filter
    if (state.filter && state.filter.length > 0) {
      const filter = this.buildODataFilter(state.filter);
      if (filter) {
        params = params.set('$filter', filter);
      }
    }

    // Custom params
    if (this.config.oDataOptions?.customParams) {
      Object.entries(this.config.oDataOptions.customParams).forEach(([key, value]) => {
        params = params.set(key, value.toString());
      });
    }

    return params;
  }

  buildODataFilter(filters: FilterDescriptor[]): string {
    return filters.map(f => {
      const field = f.field;
      const value = typeof f.value === 'string' ? `'${f.value}'` : f.value;

      switch (f.operator) {
        case 'eq': return `${field} eq ${value}`;
        case 'neq': return `${field} ne ${value}`;
        case 'lt': return `${field} lt ${value}`;
        case 'lte': return `${field} le ${value}`;
        case 'gt': return `${field} gt ${value}`;
        case 'gte': return `${field} ge ${value}`;
        case 'contains': return `contains(${field}, ${value})`;
        case 'startswith': return `startswith(${field}, ${value})`;
        case 'endswith': return `endswith(${field}, ${value})`;
        case 'in': 
          const values = Array.isArray(f.value) ? f.value : [f.value];
          const inFilters = values.map(v => `${field} eq '${v}'`).join(' or ');
          return `(${inFilters})`;
        default: return '';
      }
    }).filter(f => f).join(' and ');
  }

  applyClientFilters(data: any[]): any[] {
    return data.filter(item => {
      return this.filterDescriptors.every(filter => {
        const value = item[filter.field];
        const filterValue = filter.value;

        switch (filter.operator) {
          case 'eq': 
            return value == filterValue;
          case 'neq': 
            return value != filterValue;
          case 'lt': 
            return value < filterValue;
          case 'lte': 
            return value <= filterValue;
          case 'gt': 
            return value > filterValue;
          case 'gte': 
            return value >= filterValue;
          case 'contains': 
            return value?.toString().toLowerCase().includes(filterValue?.toString().toLowerCase());
          case 'notcontains':
            return !value?.toString().toLowerCase().includes(filterValue?.toString().toLowerCase());
          case 'startswith': 
            return value?.toString().toLowerCase().startsWith(filterValue?.toString().toLowerCase());
          case 'endswith': 
            return value?.toString().toLowerCase().endsWith(filterValue?.toString().toLowerCase());
          case 'in':
            return Array.isArray(filterValue) && filterValue.includes(value);
          case 'notin':
            return Array.isArray(filterValue) && !filterValue.includes(value);
          case 'between':
            return filter.value2 ? (value >= filterValue && value <= filter.value2) : true;
          case 'isnull': 
            return value == null;
          case 'isnotnull': 
            return value != null;
          case 'isempty':
            return value === '' || value == null;
          case 'isnotempty':
            return value !== '' && value != null;
          default: 
            return true;
        }
      });
    });
  }

  // Apply filters with custom filter list
  applyFiltersToData(data: any[], filters: any[]): any[] {
    return data.filter(item => {
      return filters.every(filter => {
        const value = item[filter.field];
        const filterValue = filter.value;

        switch (filter.operator) {
          case 'eq': 
            return value == filterValue;
          case 'neq': 
            return value != filterValue;
          case 'lt': 
            return value < filterValue;
          case 'lte': 
            return value <= filterValue;
          case 'gt': 
            return value > filterValue;
          case 'gte': 
            return value >= filterValue;
          case 'contains': 
            return value?.toString().toLowerCase().includes(filterValue?.toString().toLowerCase());
          case 'notcontains':
            return !value?.toString().toLowerCase().includes(filterValue?.toString().toLowerCase());
          case 'startswith': 
            return value?.toString().toLowerCase().startsWith(filterValue?.toString().toLowerCase());
          case 'endswith': 
            return value?.toString().toLowerCase().endsWith(filterValue?.toString().toLowerCase());
          case 'in':
            return Array.isArray(filterValue) && filterValue.includes(value);
          case 'notin':
            return Array.isArray(filterValue) && !filterValue.includes(value);
          case 'between':
            return filter.value2 ? (value >= filterValue && value <= filter.value2) : true;
          case 'isnull': 
            return value == null;
          case 'isnotnull': 
            return value != null;
          case 'isempty':
            return value === '' || value == null;
          case 'isnotempty':
            return value !== '' && value != null;
          default: 
            return true;
        }
      });
    });
  }

  // Apply global search across all columns (OR logic)
  applyGlobalSearch(data: any[], searchTerm: string): any[] {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return data.filter(item => {
      // Search in all visible columns
      return this.visibleColumns.some(column => {
        if (column.filterable === false) return false;
        
        const value = item[column.field];
        if (value == null) return false;
        
        return value.toString().toLowerCase().includes(lowerSearchTerm);
      });
    });
  }

  applyClientSort(data: any[]): any[] {
    const sorted = [...data];
    
    if (this.sortDescriptors.length === 0) return sorted;

    sorted.sort((a, b) => {
      for (const sort of this.sortDescriptors) {
        const aVal = a[sort.field];
        const bVal = b[sort.field];

        if (aVal == null && bVal == null) continue;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        let comparison = 0;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else if (aVal instanceof Date && bVal instanceof Date) {
          comparison = aVal.getTime() - bVal.getTime();
        } else {
          comparison = aVal.toString().localeCompare(bVal.toString());
        }

        if (comparison !== 0) {
          return sort.dir === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });

    return sorted;
  }

  openFilterModal(column: GridColumn) {
    if (!column.filterable) return;

    this.currentFilterColumn = column;
    this.showFilterModal = true;
    
    // Reset filter values
    this.filterSearchTerm = '';
    this.filterSearchTerm2 = '';
    this.selectedFilterValues = new Set();
    
    // Set default operator based on filter type
    if (column.filterType === 'text') {
      this.currentFilterOperator = 'contains';
    } else if (column.filterType === 'number' || column.filterType === 'date') {
      this.currentFilterOperator = 'eq';
    }

    // Load filter values for select/multiselect
    if (column.filterType === 'select' || column.filterType === 'multiselect') {
      this.loadFilterValues(column);
    }

    // Load existing filter if any
    const existingFilter = this.filterDescriptors.find(f => f.field === column.field);
    if (existingFilter) {
      this.currentFilterOperator = existingFilter.operator;
      
      if (existingFilter.operator === 'in') {
        // Multiselect filter
        this.selectedFilterValues = new Set(existingFilter.value);
      } else {
        // Text/Number/Date filter
        this.filterSearchTerm = existingFilter.value || '';
        if (existingFilter.value2) {
          this.filterSearchTerm2 = existingFilter.value2;
        }
      }
    }
  }

  loadFilterValues(column: GridColumn) {
    if (column.filterValues) {
      // Static values
      this.availableFilterValues = column.filterValues;
    } else if (column.filterValuesFn) {
      // Dynamic values from Observable
      column.filterValuesFn().subscribe(values => {
        this.availableFilterValues = values;
      });
    } else {
      // Extract unique values from data
      const dataSource = Array.isArray(this.data) ? this.data : [];
      const uniqueValues = new Set(
        dataSource
          .map(item => item[column.field])
          .filter(val => val != null && val !== '')
      );
      this.availableFilterValues = Array.from(uniqueValues).sort();
    }
  }

  toggleFilterValue(value: any) {
    if (this.selectedFilterValues.has(value)) {
      this.selectedFilterValues.delete(value);
    } else {
      this.selectedFilterValues.add(value);
    }
  }

  toggleSelectAllFilters() {
    const filtered = this.getFilteredFilterValues();
    
    if (this.selectedFilterValues.size === filtered.length) {
      this.selectedFilterValues.clear();
    } else {
      filtered.forEach(v => this.selectedFilterValues.add(v));
    }
  }

  getFilteredFilterValues(): any[] {
    if (!this.filterSearchTerm) return this.availableFilterValues;

    const searchLower = this.filterSearchTerm.toLowerCase();
    return this.availableFilterValues.filter(value =>
      value.toString().toLowerCase().includes(searchLower)
    );
  }

  applyFilter() {
    if (!this.currentFilterColumn) return;

    // Remove existing filter for this field
    this.filterDescriptors = this.filterDescriptors.filter(
      f => f.field !== this.currentFilterColumn!.field
    );

    const filterType = this.currentFilterColumn.filterType;

    // Handle multiselect/select filters
    if ((filterType === 'select' || filterType === 'multiselect') && this.selectedFilterValues.size > 0) {
      this.filterDescriptors.push({
        field: this.currentFilterColumn.field,
        operator: 'in',
        value: Array.from(this.selectedFilterValues)
      });
    }
    // Handle text, number, date filters
    else if ((filterType === 'text' || filterType === 'number' || filterType === 'date') && this.filterSearchTerm) {
      const filterDesc: any = {
        field: this.currentFilterColumn.field,
        operator: this.currentFilterOperator || 'contains',
        value: this.filterSearchTerm
      };

      // Add second value for 'between' operator
      if (this.currentFilterOperator === 'between' && this.filterSearchTerm2) {
        filterDesc.value2 = this.filterSearchTerm2;
      }

      this.filterDescriptors.push(filterDesc);
    }

    this.updateDataState();
    this.closeFilterModal();
  }

  changeFilterType(column: GridColumn, newType: 'text' | 'select' | 'multiselect') {
    column.filterType = newType;
    // Filtre tipini değiştirdiğimizde mevcut filtreyi temizle
    this.filterDescriptors = this.filterDescriptors.filter(f => f.field !== column.field);
    this.updateDataState();
  }

  clearFilter(field: string) {
    this.filterDescriptors = this.filterDescriptors.filter(f => f.field !== field);
    this.updateDataState();
  }

  clearAllFilters() {
    this.filterDescriptors = [];
    this.selectedFilterValues.clear();
    this.updateDataState();
  }

  closeFilterModal() {
    this.showFilterModal = false;
    this.currentFilterColumn = null;
    this.filterSearchTerm = '';
    this.selectedFilterValues.clear();
  }

  isFilterActive(field: string): boolean {
    return this.filterDescriptors.some(f => f.field === field);
  }

  toggleSort(column: GridColumn) {
    if (!column.sortable) return;

    const existing = this.sortDescriptors.find(s => s.field === column.field);

    if (existing) {
      if (existing.dir === 'asc') {
        existing.dir = 'desc';
      } else {
        this.sortDescriptors = this.sortDescriptors.filter(s => s.field !== column.field);
      }
    } else {
      this.sortDescriptors = [{ field: column.field, dir: 'asc' }];
    }

    this.updateDataState();
  }

  getSortIcon(column: GridColumn): string {
    const sort = this.sortDescriptors.find(s => s.field === column.field);
    if (!sort) return 'fa-sort';
    return sort.dir === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  // ==================== GROUPING ====================

  removeGroup(index: number) {
    this.groupDescriptors.splice(index, 1);
    this.updateDataState();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const skip = (page - 1) * this.pageSize;
    this.updateDataState({ skip, take: this.pageSize });
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.updateDataState({ skip: 0, take: size });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  getPageNumbers(): number[] {
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  updateDataState(partial?: Partial<DataStateChangeEvent>) {
    const current = this.dataState$.value;
    const updated: DataStateChangeEvent = {
      ...current,
      ...partial,
      sort: this.sortDescriptors,
      filter: this.filterDescriptors,
      group: this.groupDescriptors
    };
    this.dataState$.next(updated);
  }

  toggleRowSelection(row: any) {
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
    } else {
      if (!this.config.multiSelect) {
        this.selectedRows.clear();
      }
      this.selectedRows.add(row);
    }
    this.onSelectionChange.emit(Array.from(this.selectedRows));
  }

  isRowSelected(row: any): boolean {
    return this.selectedRows.has(row);
  }

  exportToCSV() {
    const headers = this.visibleColumns.map(col => col.header || col.field);
    const dataToExport = this.config.serverSide ? this.displayData : 
                         this.applyClientFilters(Array.isArray(this.data) ? this.data : []);

    const csvContent = [
      headers.join(','),
      ...dataToExport.map(row =>
        this.visibleColumns.map(col => {
          const value = row[col.field];
          return `"${value != null ? value : ''}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getCellValue(row: any, column: GridColumn, rowIndex?: number): any {
    // 1. Eğer showIndex true ise, satır numarasını döndür (1-based index)
    if (column.showIndex && rowIndex !== undefined) {
      return rowIndex + 1;
    }
    
    // 2. Eğer valueGetter varsa, özel getter kullan
    if (column.valueGetter) {
      const value = column.valueGetter(row, rowIndex ?? 0);
      // Format varsa uygula
      if (column.format) {
        return column.format(value);
      }
      return value;
    }
    
    // 3. Normal field value
    const value = row[column.field];
    if (column.format) {
      return column.format(value);
    }
    return value;
  }

  getHeaderContent(column: GridColumn): string {
    if (!column.headerContent) {
      return column.header || '';
    }
    
    if (typeof column.headerContent === 'function') {
      return column.headerContent(column);
    }
    
    return column.headerContent;
  }

  getSummaryValue(column: GridColumn): string {
    if (!column.aggregate || !this.config.showSummary) return '';

    const values = this.displayData
      .map(row => parseFloat(row[column.field]))
      .filter(v => !isNaN(v));

    let result = 0;
    switch (column.aggregate) {
      case 'sum':
        result = values.reduce((a, b) => a + b, 0);
        break;
      case 'avg':
        result = values.reduce((a, b) => a + b, 0) / values.length;
        break;
      case 'count':
        result = values.length;
        break;
      case 'min':
        result = Math.min(...values);
        break;
      case 'max':
        result = Math.max(...values);
        break;
    }

    return column.format ? column.format(result) : result.toFixed(2);
  }

  // Get custom cell style
  getCellStyle(row: any, column: GridColumn): { [key: string]: string } {
    if (!column.cellStyle) return {};
    return column.cellStyle(row);
  }

  // Get custom cell HTML
  getCellHtml(row: any, column: GridColumn, rowIndex?: number): SafeHtml {
    if (column.cellTemplate) {
      // valueGetter varsa onu kullan, yoksa normal değeri al
      const value = column.valueGetter 
        ? column.valueGetter(row, rowIndex ?? 0)
        : (column.showIndex && rowIndex !== undefined)
          ? rowIndex + 1
          : row[column.field];
      const html = column.cellTemplate(value, row);
      // Use bypassSecurityTrustHtml for template-generated content
      // This is safe because cellTemplate is controlled by the developer
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
    return this.getCellValue(row, column, rowIndex);
  }

  // Get footer value for column
  getFooterValue(column: GridColumn): string {
    // Custom footer value function
    if (column.footerValue) {
      if (typeof column.footerValue === 'function') {
        return column.footerValue(this.displayData);
      }
      return column.footerValue;
    }

    // Custom aggregate from config
    if (this.config.customAggregates && this.config.customAggregates[column.field]) {
      const aggregateFn = this.config.customAggregates[column.field];
      const result = aggregateFn(this.displayData);
      return column.format ? column.format(result) : result.toString();
    }

    // Standard aggregate
    if (column.aggregate) {
      return this.getSummaryValue(column);
    }

    return '';
  }

  // Calculate summary for export (with custom data)
  calculateSummary(column: GridColumn, data: any[]): string {
    if (!column.aggregate) return '';

    const values = data
      .map(row => parseFloat(row[column.field]))
      .filter(v => !isNaN(v));

    let result = 0;
    switch (column.aggregate) {
      case 'sum':
        result = values.reduce((a, b) => a + b, 0);
        break;
      case 'avg':
        result = values.reduce((a, b) => a + b, 0) / values.length;
        break;
      case 'count':
        result = values.length;
        break;
      case 'min':
        result = Math.min(...values);
        break;
      case 'max':
        result = Math.max(...values);
        break;
    }

    return column.format ? column.format(result) : result.toFixed(2);
  }

  // Additional methods needed for template
  exportToExcel() {
    this.exportMenuVisible = false;
    
    // Prepare data for Excel
    const dataToExport = this.displayData.length > 0 ? this.displayData : 
                         (Array.isArray(this.data) ? this.data : []);
    
    if (dataToExport.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Create HTML table that Excel can open
    let htmlContent = `
      <html xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta charset="UTF-8">
        <style>
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #4f46e5; color: white; font-weight: bold; border: 1px solid #ddd; padding: 8px; text-align: left; }
          td { border: 1px solid #ddd; padding: 8px; }
          tr:nth-child(even) { background-color: #f8f9fa; }
          .summary-row { font-weight: bold; background-color: #e9ecef; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
    `;

    // Add headers
    this.visibleColumns.forEach(col => {
      htmlContent += `<th>${col.header || col.field}</th>`;
    });
    htmlContent += `</tr></thead><tbody>`;

    // Add data rows
    dataToExport.forEach(item => {
      htmlContent += '<tr>';
      this.visibleColumns.forEach(col => {
        const value = item[col.field] ?? '';
        htmlContent += `<td>${value}</td>`;
      });
      htmlContent += '</tr>';
    });

    // Add summary row if showSummary is enabled
    if (this.config.showSummary) {
      htmlContent += '<tr class="summary-row">';
      this.visibleColumns.forEach(col => {
        if (col.aggregate) {
          const summaryValue = this.calculateSummary(col, dataToExport);
          htmlContent += `<td>Sum: ${summaryValue}</td>`;
        } else {
          htmlContent += '<td></td>';
        }
      });
      htmlContent += '</tr>';
    }

    htmlContent += `</tbody></table></body></html>`;

    // Create blob and download as .xls file
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `export_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  exportToPDF() {
    this.exportMenuVisible = false;
    
    // Prepare data for PDF
    const dataToExport = this.displayData.length > 0 ? this.displayData : 
                         (Array.isArray(this.data) ? this.data : []);
    
    if (dataToExport.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Create optimized HTML table for PDF with better styling
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Data Export - ${new Date().toLocaleDateString()}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            padding: 30px;
            background: white;
            color: #333;
          }
          .header {
            margin-bottom: 30px;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 15px;
          }
          h1 { 
            color: #4f46e5; 
            font-size: 28px; 
            margin-bottom: 8px;
            font-weight: 600;
          }
          .export-date {
            color: #6b7280;
            font-size: 14px;
          }
          table { 
            border-collapse: collapse; 
            width: 100%; 
            margin-top: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          thead {
            background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          }
          th { 
            color: white; 
            padding: 14px 12px; 
            text-align: left; 
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-right: 1px solid rgba(255,255,255,0.1);
          }
          th:last-child {
            border-right: none;
          }
          td { 
            border: 1px solid #e5e7eb; 
            padding: 12px;
            font-size: 13px;
          }
          tbody tr:nth-child(even) { 
            background: #f9fafb; 
          }
          tbody tr:hover { 
            background: #f3f4f6; 
          }
          .summary-row { 
            background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%) !important;
            font-weight: 700;
            border-top: 3px solid #4f46e5;
          }
          .summary-row td { 
            padding: 14px 12px;
            color: #4f46e5;
            font-size: 14px;
            border: 1px solid #c7d2fe;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
          }
          @media print {
            body { padding: 20px; }
            .header { page-break-after: avoid; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
          }
          @page {
            margin: 20mm;
            size: A4 landscape;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Data Export</h1>
          <div class="export-date">Generated on ${new Date().toLocaleString()}</div>
        </div>
        <table>
          <thead>
            <tr>
    `;

    // Add headers
    this.visibleColumns.forEach(col => {
      htmlContent += `<th>${col.header || col.field}</th>`;
    });
    htmlContent += `</tr></thead><tbody>`;

    // Add data rows
    dataToExport.forEach(item => {
      htmlContent += '<tr>';
      this.visibleColumns.forEach(col => {
        const value = item[col.field] ?? '';
        htmlContent += `<td>${value}</td>`;
      });
      htmlContent += '</tr>';
    });

    // Add summary row if showSummary is enabled
    if (this.config.showSummary) {
      htmlContent += '<tr class="summary-row">';
      this.visibleColumns.forEach(col => {
        if (col.aggregate) {
          const summaryValue = this.calculateSummary(col, dataToExport);
          const aggregateLabel = this.getAggregateLabel(col.aggregate);
          htmlContent += `<td><strong>${aggregateLabel}:</strong> ${summaryValue}</td>`;
        } else {
          htmlContent += '<td></td>';
        }
      });
      htmlContent += '</tr>';
    }

    htmlContent += `
          </tbody>
        </table>
        <div class="footer">
          Exported ${dataToExport.length} records | Total columns: ${this.visibleColumns.length}
        </div>
      </body>
      </html>
    `;

    // Create blob and download as PDF-ready HTML
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `export_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Also open for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  }

  getFilteredValues(): any[] {
    return this.getFilteredFilterValues();
  }

  clearCurrentFilter() {
    if (this.currentFilterColumn) {
      this.clearFilter(this.currentFilterColumn.field);
    }
    this.closeFilterModal();
  }

  isAllSelected(): boolean {
    return this.displayData.length > 0 && this.displayData.every(item => this.isRowSelected(item));
  }

  isSomeSelected(): boolean {
    return this.displayData.some(item => this.isRowSelected(item)) && !this.isAllSelected();
  }

  toggleSelectAll() {
    if (this.isAllSelected()) {
      this.displayData.forEach(item => this.selectedRows.delete(item));
    } else {
      this.displayData.forEach(item => this.selectedRows.add(item));
    }
    this.onSelectionChange.emit(Array.from(this.selectedRows));
  }

  trackByField(index: number, column: GridColumn): string {
    return column.field;
  }

  getSortDirection(field: string): string | null {
    const sort = this.sortDescriptors.find(s => s.field === field);
    return sort ? sort.dir : null;
  }

  onDragStart(column: GridColumn, event: DragEvent) {
    this.onColumnDragStart(event, column);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(column: GridColumn, event: DragEvent) {
    this.onColumnDrop(event, column);
  }

  isColumnFiltered(field: string): boolean {
    return this.isFilterActive(field);
  }

  openFilterModalWithEvent(column: GridColumn, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.openFilterModal(column);
  }

  startResize(column: GridColumn, event: MouseEvent) {
    this.onResizeStart(event, column);
    document.addEventListener('mousemove', this.onResizeMove);
    document.addEventListener('mouseup', this.onResizeEnd);
  }

  hasActions(): boolean {
    // Check if there's an 'actions' column defined
    return this.columns.some(col => col.field === 'actions');
  }

  getGroupedData(): any[] {
    if (this.groupDescriptors.length === 0) {
      return [{ items: this.displayData, expanded: true }];
    }
    // For now, return ungrouped data
    return [{ items: this.displayData, expanded: true }];
  }

  trackByGroup(index: number, group: any): any {
    return index;
  }

  getColspan(): number {
    let count = this.visibleColumns.length;
    if (this.config.selectable) count++;
    if (this.hasActions()) count++;
    return count;
  }

  getDisplayItems(group: any): any[] {
    return group.items || [];
  }

  trackByItem(index: number, item: any): any {
    return item.id || index;
  }

  isEvenRow(item: any): boolean {
    const index = this.displayData.indexOf(item);
    return index % 2 === 0;
  }

  isOddRow(item: any): boolean {
    return !this.isEvenRow(item);
  }

  formatCellValue(value: any, column: GridColumn): string {
    if (column.format) {
      return column.format(value);
    }
    if (value == null) return '';
    if (column.type === 'date' && value instanceof Date) {
      return value.toLocaleDateString();
    }
    if (column.type === 'number' && typeof value === 'number') {
      return value.toFixed(2);
    }
    return value.toString();
  }

  editRow(item: any) {
    this.onEdit.emit(item);
  }

  deleteRow(item: any) {
    this.onDelete.emit(item);
  }

  hasAggregates(): boolean {
    return this.visibleColumns.some(col => col.aggregate);
  }

  getStartRecord(): number {
    return this.displayData.length === 0 ? 0 : ((this.currentPage - 1) * this.pageSize) + 1;
  }

  getEndRecord(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  onPageSizeChangeHandler() {
    this.onPageSizeChange(this.pageSize);
  }

  goToPage(page: number) {
    this.onPageChange(page);
  }

  getTotalPages(): number {
    return this.totalPages;
  }

  toggleGroup(group: any) {
    group.expanded = !group.expanded;
  }

  formatAggregates(aggregates: any): string {
    return JSON.stringify(aggregates);
  }

  // ==================== NEW ADVANCED FEATURES ====================
  
  // Global Search
  globalSearchTerm = '';
  
  onGlobalSearch() {
    if (!this.globalSearchTerm || !this.globalSearchTerm.trim()) {
      this.clearAllFilters();
      return;
    }
    
    // Clear existing filters for global search
    this.filterDescriptors = [];
    
    // Global search will be handled in loadClientData by checking all columns
    this.loadData();
  }

  // Multi-Sort
  getSortPriority(field: string): number {
    const index = this.sortDescriptors.findIndex(s => s.field === field);
    return index >= 0 ? index + 1 : 0;
  }

  onHeaderClick(column: GridColumn, event?: MouseEvent) {
    if (!column.sortable || !this.config.sortable) return;
    
    if (this.config.multiSort && event?.ctrlKey) {
      // Multi-sort with Ctrl+Click
      this.toggleMultiSort(column);
    } else {
      // Single sort
      this.toggleSort(column);
    }
  }

  toggleMultiSort(column: GridColumn) {
    const existing = this.sortDescriptors.find(s => s.field === column.field);
    
    if (existing) {
      if (existing.dir === 'asc') {
        existing.dir = 'desc';
      } else {
        // Remove this sort
        this.sortDescriptors = this.sortDescriptors.filter(s => s.field !== column.field);
      }
    } else {
      // Add new sort
      this.sortDescriptors.push({ field: column.field, dir: 'asc' });
    }
    
    this.updateDataState();
  }

  // Inline Editing
  editingRow: any = null;
  editingRowCopy: any = null;

  startEdit(row: any, column?: GridColumn) {
    if (!this.config.editable) return;
    this.editingRow = row;
    this.editingRowCopy = { ...row };
  }

  saveEdit(row: any) {
    if (!this.editingRow) return;
    this.editingRow = null;
    this.editingRowCopy = null;
    this.onEdit.emit(row);
  }

  cancelEdit() {
    if (this.editingRow && this.editingRowCopy) {
      Object.assign(this.editingRow, this.editingRowCopy);
    }
    this.editingRow = null;
    this.editingRowCopy = null;
  }

  // Column Pinning
  togglePinColumn(column: GridColumn, event?: Event) {
    if (event) event.stopPropagation();
    
    if (column.pinned === 'left') {
      column.pinned = undefined;
    } else {
      column.pinned = 'left';
    }
    
    this.sortColumnsByPin();
  }

  sortColumnsByPin() {
    this.allColumns.sort((a, b) => {
      if (a.pinned === 'left' && b.pinned !== 'left') return -1;
      if (a.pinned !== 'left' && b.pinned === 'left') return 1;
      if (a.pinned === 'right' && b.pinned !== 'right') return 1;
      if (a.pinned !== 'right' && b.pinned === 'right') return -1;
      return 0;
    });
    this.updateVisibleColumns();
  }

  // Row Details
  expandedRows: Set<any> = new Set();

  toggleRowDetails(row: any) {
    if (this.expandedRows.has(row)) {
      this.expandedRows.delete(row);
    } else {
      this.expandedRows.add(row);
    }
  }

  // Cell Styling
  getCellClass(column: GridColumn, row: any): string {
    let classes = `cell-${column.field}`;
    
    // Add actions-cell class for actions column
    if (column.field === 'actions') {
      classes += ' actions-cell';
    }
    
    if (column.cellClass) {
      if (typeof column.cellClass === 'function') {
        classes += ` ${column.cellClass(row)}`;
      } else {
        classes += ` ${column.cellClass}`;
      }
    }
    
    // Conditional formatting example
    if (this.config.conditionalFormatting && column.type === 'number') {
      const value = row[column.field];
      if (value > 100) classes += ' cell-high';
      else if (value < 10) classes += ' cell-low';
    }
    
    return classes;
  }

  // Aggregates
  getAggregateLabel(aggregate: string): string {
    const labels: any = {
      sum: 'Sum',
      avg: 'Average',
      count: 'Count',
      min: 'Min',
      max: 'Max'
    };
    return labels[aggregate] || aggregate;
  }

  // Group helpers
  getColumnHeader(field: string): string {
    const column = this.allColumns.find(c => c.field === field);
    return column?.header || field;
  }

  onGroupDrop(event: DragEvent) {
    event.preventDefault();
    if (!this.draggedColumn) return;
    
    const exists = this.groupDescriptors.find(g => g.field === this.draggedColumn!.field);
    if (!exists && this.draggedColumn.groupable !== false) {
      this.groupDescriptors.push({
        field: this.draggedColumn.field,
        dir: 'asc'
      });
      this.updateDataState();
    }
    this.draggedColumn = null;
  }

  // State Management
  saveGridState() {
    if (!this.config.persistState) return;
    
    const state = {
      columns: this.allColumns.map(c => ({
        field: c.field,
        visible: c.visible,
        width: c.width,
        pinned: c.pinned
      })),
      sorts: this.sortDescriptors,
      filters: this.filterDescriptors,
      groups: this.groupDescriptors,
      pageSize: this.pageSize
    };
    
    const key = this.config.stateKey || 'grid-state';
    localStorage.setItem(key, JSON.stringify(state));
  }

  loadGridState() {
    if (!this.config.persistState) return;
    
    const key = this.config.stateKey || 'grid-state';
    const saved = localStorage.getItem(key);
    
    if (saved) {
      try {
        const state = JSON.parse(saved);
        
        // Restore column state
        if (state.columns) {
          state.columns.forEach((savedCol: any) => {
            const column = this.allColumns.find(c => c.field === savedCol.field);
            if (column) {
              column.visible = savedCol.visible;
              column.width = savedCol.width;
              column.pinned = savedCol.pinned;
            }
          });
          this.updateVisibleColumns();
        }
        
        // Restore sorts, filters, groups
        if (state.sorts) this.sortDescriptors = state.sorts;
        if (state.filters) this.filterDescriptors = state.filters;
        if (state.groups) this.groupDescriptors = state.groups;
        if (state.pageSize) this.pageSize = state.pageSize;
        
        this.updateDataState();
      } catch (e) {
        console.error('Failed to load grid state:', e);
      }
    }
  }

  resetGridState() {
    if (this.config.persistState) {
      const key = this.config.stateKey || 'grid-state';
      localStorage.removeItem(key);
    }
    
    // Reset to defaults
    this.sortDescriptors = [];
    this.filterDescriptors = [];
    this.groupDescriptors = [];
    this.pageSize = this.config.pageSize || 25;
    this.currentPage = 1;
    
    this.initializeColumns();
    this.updateDataState();
  }

  // Theme Detection & Management
  detectTheme() {
    if (this.theme === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
      
      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (this.theme === 'auto') {
          this.currentTheme = e.matches ? 'dark' : 'light';
        }
      });
    } else {
      this.currentTheme = this.theme;
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
  }

  onColumnSearch(field: string) {
    const searchTerm = this.columnSearchTerms[field];
    
    // Remove existing column search filter for this field
    this.columnSearchFilters = this.columnSearchFilters.filter(f => f.field !== field);
    
    // If search term is not empty, add new filter
    if (searchTerm && searchTerm.trim()) {
      this.columnSearchFilters.push({
        field: field,
        operator: 'contains',
        value: searchTerm.trim()
      });
    }
    
    // Reload data with combined filters
    this.loadData();
  }

  // Modal Methods
  openModal(type: 'edit' | 'delete' | 'add', data?: any) {
    this.modalType = type;
    this.modalData = data;
    this.showModal = true;
    
    // Emit events for consumer to handle
    if (type === 'edit') {
      this.onEdit.emit(data);
    } else if (type === 'delete') {
      this.onDelete.emit(data);
    } else if (type === 'add') {
      this.onAdd.emit();
    }
  }

  closeModal() {
    this.showModal = false;
    this.modalType = null;
    this.modalData = null;
  }

  handleAddClick() {
    this.openModal('add');
  }
}

