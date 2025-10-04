# Smart Defaults Feature

## Overview
The data grid now includes smart defaults that reduce boilerplate configuration. Column headers are automatically generated from field names, and the actions column is automatically added when an actions template is provided.

## Auto-Header Generation

### How It Works
The `generateHeaderFromField()` method automatically converts field names to user-friendly headers:

- **camelCase**: `orderDate` → `"Order Date"`
- **snake_case**: `ship_country` → `"Ship Country"`
- **Simple names**: `id` → `"Id"`, `customer` → `"Customer"`

### Algorithm
```typescript
private generateHeaderFromField(field: string): string {
  // Replace underscores and camelCase boundaries with spaces
  let header = field
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Capitalize first letter of each word
  return header
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

### Usage Examples

#### Minimal Configuration (Auto-Generated Headers)
```typescript
columns: GridColumn[] = [
  {
    field: 'id',
    // header otomatik: "Id"
    sortable: true,
    filterable: true,
  },
  {
    field: 'orderDate',
    // header otomatik: "Order Date"
    sortable: true,
    type: 'date',
  },
  {
    field: 'shipCountry',
    // header otomatik: "Ship Country"
    filterable: true,
  }
];
```

#### Localization Override (Turkish Example)
```typescript
columns: GridColumn[] = [
  {
    field: 'customer',
    header: 'Müşteri Adı', // Override for Turkish localization
    sortable: true,
  },
  {
    field: 'freight',
    header: 'Nakliye Ücreti', // Custom Turkish header
    type: 'number',
  },
  {
    field: 'shippingCompany',
    // header otomatik: "Shipping Company" (English default)
    filterable: true,
  }
];
```

## Auto-Actions Column

### How It Works
The actions column is automatically added to your columns array when you provide an actions template:

```typescript
private applyContentTemplates(): void {
  if (this.contentTemplates.length === 0) return;

  this.contentTemplates.forEach((template: any) => {
    const templateField = template.gridCellTemplate;
    
    // Auto-add actions column if template is provided
    if (templateField === 'actions') {
      const actionsColumn: GridColumn = {
        field: 'actions',
        header: 'Actions',
        sortable: false,
        filterable: false,
        width: '120px'
      };
      
      if (!this.columns.find(col => col.field === 'actions')) {
        this.columns.push(actionsColumn);
      }
    }
    
    // Apply template to column
    this.applyCellTemplateToColumn(templateField, template);
  });
}
```

### Usage Example

#### Template in Component HTML
```html
<!-- Actions template - column otomatik eklenecek -->
<ng-template gridCellTemplate="actions" let-row="row">
  @if (editingRow?.id === row.id) {
    <!-- Edit mode: Save & Cancel buttons -->
    <div class="action-buttons">
      <button (click)="saveEdit(row)">💾 Save</button>
      <button (click)="cancelEdit()">❌ Cancel</button>
    </div>
  } @else {
    <!-- Normal mode: Edit & Delete buttons -->
    <div class="action-buttons">
      <button (click)="startEdit(row)">✏️ Edit</button>
      <button (click)="deleteRow(row)">🗑️ Delete</button>
    </div>
  }
</ng-template>
```

#### Component TypeScript
```typescript
columns: GridColumn[] = [
  { field: 'id', sortable: true },
  { field: 'customer', header: 'Müşteri Adı' },
  { field: 'orderDate' }
  // NO NEED to add actions column here - it's automatic!
  // Actions column otomatik eklenecek (ng-template varsa)
];
```

### Without Actions Template
If you don't provide an actions template, no actions column will appear:

```html
<!-- No actions template provided -->
<app-data-grid
  [data]="data"
  [columns]="columns"
  [gridConfig]="gridConfig">
  <!-- Other templates only -->
</app-data-grid>
```

Result: Clean grid with only your data columns, no actions column.

## Benefits

### 1. Less Boilerplate
**Before:**
```typescript
columns: GridColumn[] = [
  { field: 'id', header: 'Id' },
  { field: 'customer', header: 'Customer' },
  { field: 'orderDate', header: 'Order Date' },
  { field: 'shipCountry', header: 'Ship Country' },
  { field: 'shippingCompany', header: 'Shipping Company' },
  { field: 'actions', header: 'Actions', sortable: false }
];
```

**After:**
```typescript
columns: GridColumn[] = [
  { field: 'id' },
  { field: 'customer' },
  { field: 'orderDate' },
  { field: 'shipCountry' },
  { field: 'shippingCompany' }
  // Actions auto-added if template provided
];
```

### 2. Easy Localization
Override only the headers you need to localize:
```typescript
columns: GridColumn[] = [
  { field: 'id' }, // Auto: "Id"
  { field: 'customer', header: 'Müşteri' }, // Turkish
  { field: 'orderDate' }, // Auto: "Order Date"
  { field: 'freight', header: 'Navlun' }, // Turkish
  { field: 'shipCountry' } // Auto: "Ship Country"
];
```

### 3. Optional Actions
Actions column only appears when needed:
- **With template**: Actions column automatically added
- **Without template**: Clean data-only grid
- No need to manually manage actions column visibility

## Interface Changes

### GridColumn Interface
```typescript
export interface GridColumn {
  field: string;
  header?: string; // Optional - auto-generated from field if not provided
  // ... other properties
}
```

The `header` property is now optional. If omitted, it will be automatically generated from the `field` name.

## Implementation Details

### Column Initialization
```typescript
private initializeColumns(): void {
  if (!this.columns?.length) return;

  this.columns.forEach(col => {
    // Auto-generate header if not provided
    if (!col.header) {
      col.header = this.generateHeaderFromField(col.field);
    }
    
    // ... other initialization
  });
}
```

### Actions Detection
```typescript
hasActions(): boolean {
  return this.columns.some(col => col.field === 'actions');
}
```

This method checks if the actions column was automatically added (or manually specified).

## Best Practices

### 1. Use Auto-Headers for English
Let the system generate headers for standard English field names:
```typescript
{ field: 'customerName' }  // Auto: "Customer Name"
{ field: 'orderDate' }     // Auto: "Order Date"
{ field: 'ship_country' }  // Auto: "Ship Country"
```

### 2. Override for Localization
Specify custom headers only when localizing:
```typescript
{ field: 'customer', header: 'Müşteri Adı' }     // Turkish
{ field: 'freight', header: 'Frete' }            // Portuguese
{ field: 'orderDate', header: 'Date de commande' } // French
```

### 3. Let Actions Auto-Add
Don't manually add the actions column:
```typescript
// ❌ DON'T DO THIS
columns: GridColumn[] = [
  { field: 'id' },
  { field: 'customer' },
  { field: 'actions', header: 'Actions', sortable: false } // Manual
];

// ✅ DO THIS INSTEAD
columns: GridColumn[] = [
  { field: 'id' },
  { field: 'customer' }
  // Actions will be auto-added if ng-template exists
];
```

### 4. Clean Component Code
Focus on your data structure, not UI boilerplate:
```typescript
@Component({
  // ...
})
export class MyGridComponent {
  columns: GridColumn[] = [
    { field: 'id', type: 'number' },
    { field: 'name' },
    { field: 'email' },
    { field: 'createdAt', type: 'date' }
    // Headers auto-generated, actions auto-added
  ];
}
```

## Migration Guide

### Upgrading Existing Grids

1. **Remove redundant headers** (optional):
   ```typescript
   // Before
   { field: 'orderDate', header: 'Order Date' }
   
   // After
   { field: 'orderDate' } // Auto-generates "Order Date"
   ```

2. **Remove actions column** from columns array:
   ```typescript
   // Before
   columns: GridColumn[] = [
     { field: 'id' },
     { field: 'actions', header: 'Actions', sortable: false }
   ];
   
   // After
   columns: GridColumn[] = [
     { field: 'id' }
     // Actions auto-added if template exists
   ];
   ```

3. **Keep localized headers**:
   ```typescript
   // Keep these overrides
   { field: 'customer', header: 'Müşteri Adı' }
   { field: 'freight', header: 'Nakliye Ücreti' }
   ```

### Backward Compatibility
The changes are fully backward compatible:
- Existing explicit headers still work
- Manually added actions columns are preserved
- No breaking changes to existing code

## Testing

### Test Auto-Header Generation
```typescript
// Test case 1: camelCase
field: 'orderDate' → header: "Order Date" ✅

// Test case 2: snake_case
field: 'ship_country' → header: "Ship Country" ✅

// Test case 3: Simple
field: 'id' → header: "Id" ✅

// Test case 4: Complex camelCase
field: 'customerFirstName' → header: "Customer First Name" ✅
```

### Test Auto-Actions
```typescript
// Test case 1: With template
<ng-template gridCellTemplate="actions">...</ng-template>
→ Actions column added automatically ✅

// Test case 2: Without template
No actions template
→ No actions column in grid ✅

// Test case 3: Manual actions column
{ field: 'actions', header: 'Custom Actions' }
→ Uses manual definition (not auto-added) ✅
```

## Future Enhancements

Potential improvements for future versions:

1. **i18n Integration**: Integrate with Angular i18n for automatic translations
2. **Custom Header Transformers**: Allow users to provide custom header generation functions
3. **Header Casing Options**: Support different casing styles (Title Case, Sentence case, etc.)
4. **Smart Type Detection**: Auto-detect column types from data
5. **Template Auto-Detection**: Auto-detect other common templates (status, tags, etc.)

## Conclusion

Smart defaults make the grid easier to use by:
- ✅ Reducing configuration boilerplate
- ✅ Supporting easy localization
- ✅ Making actions truly optional
- ✅ Maintaining full backward compatibility
- ✅ Following the principle of "convention over configuration"

Start simple, customize only what you need!
