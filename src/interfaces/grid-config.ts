import { ODataOptions } from "../data-grid/interfaces/odata-options";

export interface GridConfig {
  // Pagination
  pageable?: boolean;
  pageSize?: number;
  pageSizes?: number[];
  serverSide?: boolean; // Server-side pagination
  virtualScroll?: boolean; // Virtual scrolling for large datasets
  
  // Features
  sortable?: boolean;
  multiSort?: boolean; // Multi-column sorting
  filterable?: boolean;
  advancedFiltering?: boolean; // Advanced filter operators
  groupable?: boolean;
  dragGrouping?: boolean; // Drag & drop grouping
  exportable?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  showSummary?: boolean;
  
  // Column Management
  columnMenu?: boolean; // Column visibility menu
  resizable?: boolean; // Column width resizable
  reorderable?: boolean; // Column order changeable
  pinnable?: boolean; // Column pinning (freeze)
  autoFitColumns?: boolean; // Auto-fit column widths
  
  // Row Operations
  editable?: boolean; // Inline editing
  rowDetails?: boolean; // Expandable row details
  rowDraggable?: boolean; // Drag & drop rows
  
  // Search & Filter
  globalSearch?: boolean; // Search across all columns
  inlineSearch?: boolean; // Inline search inputs in header
  filterMode?: 'row' | 'menu' | 'both'; // Filter UI mode
  
  // Styling
  conditionalFormatting?: boolean; // Cell coloring based on conditions
  striped?: boolean; // Alternate row colors
  bordered?: boolean; // Show borders
  hover?: boolean; // Highlight on hover
  
  // State Management
  persistState?: boolean; // Save state to localStorage
  stateKey?: string; // Key for state persistence
  
  // Footer
  showFooter?: boolean; // Show table footer
  footerClass?: string; // CSS class for footer
  customAggregates?: { [field: string]: (data: any[]) => any }; // Custom aggregate functions
  
  // Performance
  debounceTime?: number; // Debounce time for operations (ms)
  
  // OData
  oDataUrl?: string;
  oDataOptions?: ODataOptions;
}