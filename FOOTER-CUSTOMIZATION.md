# Footer Customization Guide

## Overview
Grid'de 3 tip footer yönetimi var:

1. **Column Footer** - Her kolonun altında özel değerler (sum, avg, custom)
2. **Summary Row** - Otomatik aggregate hesaplamaları
3. **Grid Footer** - Pagination ve genel bilgiler

## 1. Column Footer (Template-Based) ✅

### Kullanım

#### Option 1: ng-template ile (HTML)
```html
<app-data-grid [data]="data" [columns]="columns">
  <!-- Freight column footer -->
  <ng-template gridFooterTemplate="freight" let-data="data" let-column="column">
    <div style="font-weight: bold; color: #10b981;">
      Total: ${{ calculateTotal(data, 'freight') }}
    </div>
  </ng-template>
  
  <!-- Customer column footer -->
  <ng-template gridFooterTemplate="customer" let-data="data">
    <div style="background: #667eea20; padding: 4px 8px; border-radius: 4px;">
      {{ data.length }} Customers
    </div>
  </ng-template>
</app-data-grid>
```

#### Option 2: footerValue function (TypeScript)
```typescript
columns: GridColumn[] = [
  {
    field: 'freight',
    header: 'Freight',
    footerValue: (data: any[]) => {
      const total = data.reduce((sum, row) => sum + (row.freight || 0), 0);
      const avg = total / data.length;
      return `Total: $${total.toFixed(2)} | Avg: $${avg.toFixed(2)}`;
    }
  },
  {
    field: 'shippingCompany',
    footerValue: (data: any[]) => {
      const unique = new Set(data.map(row => row.shippingCompany));
      return `${unique.size} Companies`;
    }
  }
];
```

#### Option 3: Static footerValue (String)
```typescript
{
  field: 'status',
  footerValue: 'Total Records'
}
```

### Öncelik Sırası
1. **footerTemplate** (ng-template) → En yüksek öncelik, tam kontrol
2. **footerValue** (function) → TypeScript'te hesaplama
3. **footerValue** (string) → Sabit text
4. **aggregate** + customAggregates → Otomatik hesaplama

---

## 2. Summary Row (Aggregate-Based) ✅

### Kullanım

```typescript
columns: GridColumn[] = [
  {
    field: 'id',
    aggregate: 'count' // Kayıt sayısı
  },
  {
    field: 'freight',
    aggregate: 'sum' // Toplam
  },
  {
    field: 'price',
    aggregate: 'avg' // Ortalama
  }
];

gridConfig: GridConfig = {
  showSummary: true // Summary row'u göster
};
```

### Özel Aggregate Hesaplamaları

```typescript
gridConfig: GridConfig = {
  showSummary: true,
  customAggregates: {
    orderDate: (data: any[]) => {
      const dates = data.map(row => new Date(row.orderDate));
      const oldest = Math.min(...dates.map(d => d.getTime()));
      const newest = Math.max(...dates.map(d => d.getTime()));
      return `${new Date(oldest).toLocaleDateString()} - ${new Date(newest).toLocaleDateString()}`;
    },
    shipCountry: (data: any[]) => {
      const unique = new Set(data.map(row => row.shipCountry));
      return `${unique.size} Countries`;
    }
  }
};
```

### Aggregate Tipleri
- `'sum'` - Toplam
- `'avg'` - Ortalama
- `'count'` - Sayım
- `'min'` - Minimum
- `'max'` - Maximum

---

## 3. Grid Footer (Pagination & Info) ✅

### Kullanım

```typescript
gridConfig: GridConfig = {
  pageable: true,
  pageSize: 25,
  pageSizes: [10, 25, 50, 100],
  
  // Footer configuration
  showFooter: true, // Column footer'ları göster
  footerClass: 'custom-footer-style' // Özel CSS class
};
```

### Footer Structure

```
┌─────────────────────────────────────────────────┐
│  Column Footers (customizable)                  │
│  [Total: $1,234] [25 items] [...]              │
├─────────────────────────────────────────────────┤
│  Pagination & Info (built-in)                   │
│  Showing 1 to 25 of 100 entries                │
│  [10▼] [⏮] [◀] [1] [2] [3] [▶] [⏭]            │
└─────────────────────────────────────────────────┘
```

---

## 4. Complete Example

### grid-template.ts

```typescript
columns: GridColumn[] = [
  // Row Index
  {
    field: 'rowIndex',
    header: '#',
    showIndex: true,
    width: '60px',
    footerValue: 'Total:' // Sabit text
  },
  
  // ID with count
  {
    field: 'id',
    sortable: true,
    aggregate: 'count', // Otomatik count
    // footerValue kullanılmadı, aggregate kullanılacak
  },
  
  // Customer with template
  {
    field: 'customer',
    header: 'Customer',
    // footerValue yerine ng-template kullanılacak
  },
  
  // Freight with function
  {
    field: 'freight',
    header: 'Freight',
    footerValue: (data: any[]) => {
      const total = data.reduce((sum, row) => sum + (row.freight || 0), 0);
      const avg = total / data.length;
      return `Total: $${total.toFixed(2)} | Avg: $${avg.toFixed(2)}`;
    }
  },
  
  // Ship Country with custom aggregate
  {
    field: 'shipCountry',
    header: 'Country',
    // customAggregates'de tanımlanacak
  }
];

gridConfig: GridConfig = {
  showSummary: true, // Summary row göster (aggregate'ler için)
  showFooter: true, // Column footer'ları göster (footerValue/template için)
  footerClass: 'my-custom-footer',
  
  customAggregates: {
    shipCountry: (data: any[]) => {
      const unique = new Set(data.map(row => row.shipCountry));
      return `${unique.size} Countries`;
    }
  }
};
```

### grid-template.html

```html
<app-data-grid
  [data]="gridData"
  [columns]="columns"
  [config]="gridConfig">
  
  <!-- Customer Footer Template -->
  <ng-template gridFooterTemplate="customer" let-data="data">
    <div style="
      background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 600;
      color: #667eea;
      text-align: center;
    ">
      {{ data.length }} Customers
    </div>
  </ng-template>
  
  <!-- Freight Footer Template -->
  <ng-template gridFooterTemplate="freight" let-data="data" let-column="column">
    <div style="
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 12px;
    ">
      <div style="font-weight: 700; color: var(--primary-color);">
        Total: ${{ calculateTotal(data, 'freight') }}
      </div>
      <div style="color: var(--text-secondary);">
        Avg: ${{ calculateAverage(data, 'freight') }}
      </div>
    </div>
  </ng-template>
  
</app-data-grid>
```

### grid-template.css

```css
/* Custom footer styles */
.custom-footer-style {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-top: 2px solid #667eea;
}

.custom-footer-style .footer-cell {
  padding: 12px;
  font-weight: 600;
}
```

---

## 5. Footer Priority Logic

### Data-Grid içindeki mantık:

```typescript
getFooterValue(column: GridColumn): string {
  // 1. Custom footer value function
  if (column.footerValue) {
    if (typeof column.footerValue === 'function') {
      return column.footerValue(this.displayData);
    }
    return column.footerValue; // Static string
  }

  // 2. Custom aggregate from config
  if (this.config.customAggregates && this.config.customAggregates[column.field]) {
    return this.config.customAggregates[column.field](this.displayData);
  }

  // 3. Built-in aggregate
  if (column.aggregate && this.config.showSummary) {
    return this.getSummaryValue(column);
  }

  return ''; // No footer
}
```

### HTML Render Mantığı:

```html
<td class="footer-cell">
  @if (column.footerTemplate) {
    <!-- 1. Template (highest priority) -->
    <ng-container *ngTemplateOutlet="column.footerTemplate; 
                    context: { data: displayData, column: column }">
    </ng-container>
  } @else {
    <!-- 2. footerValue or aggregate -->
    <span class="footer-value">{{ getFooterValue(column) }}</span>
  }
</td>
```

---

## 6. Best Practices

### ✅ DO

1. **Use ng-template for complex footers**
   ```html
   <ng-template gridFooterTemplate="price" let-data="data">
     <div class="price-summary">
       <span class="total">${{ total }}</span>
       <span class="avg">(avg: ${{ avg }})</span>
     </div>
   </ng-template>
   ```

2. **Use footerValue function for calculations**
   ```typescript
   footerValue: (data) => {
     const total = data.reduce((sum, row) => sum + row.price, 0);
     return `Total: $${total.toFixed(2)}`;
   }
   ```

3. **Use aggregate for simple summaries**
   ```typescript
   { field: 'quantity', aggregate: 'sum' }
   ```

4. **Use customAggregates for reusable logic**
   ```typescript
   customAggregates: {
     date: (data) => getDateRange(data),
     status: (data) => getStatusSummary(data)
   }
   ```

### ❌ DON'T

1. **Don't mix aggregate and footerValue**
   ```typescript
   // ❌ BAD: aggregate ignored if footerValue exists
   {
     field: 'price',
     aggregate: 'sum',
     footerValue: 'Total' // aggregate won't work!
   }
   
   // ✅ GOOD: Choose one
   { field: 'price', aggregate: 'sum' }
   // OR
   { field: 'price', footerValue: (data) => calculateSum(data) }
   ```

2. **Don't use heavy computation in footerValue**
   ```typescript
   // ❌ BAD: Runs on every change detection
   footerValue: (data) => {
     // Heavy API call or computation
     return expensiveCalculation(data);
   }
   
   // ✅ GOOD: Pre-calculate or use memo
   footerValue: (data) => this.cachedFooterValue
   ```

3. **Don't forget showFooter config**
   ```typescript
   // ❌ BAD: Footer won't show
   columns: [
     { field: 'price', footerValue: 'Total' }
   ]
   
   // ✅ GOOD
   columns: [
     { field: 'price', footerValue: 'Total' }
   ],
   gridConfig: {
     showFooter: true // Enable footer!
   }
   ```

---

## 7. Advanced Examples

### Example 1: Multi-Line Footer

```html
<ng-template gridFooterTemplate="sales" let-data="data">
  <div style="text-align: right; line-height: 1.4;">
    <div style="font-weight: bold; color: #10b981;">
      Total: ${{ calculateTotal(data, 'sales') }}
    </div>
    <div style="font-size: 11px; color: #666;">
      Avg: ${{ calculateAvg(data, 'sales') }}
    </div>
    <div style="font-size: 10px; color: #999;">
      Min: ${{ calculateMin(data, 'sales') }} | 
      Max: ${{ calculateMax(data, 'sales') }}
    </div>
  </div>
</ng-template>
```

### Example 2: Progress Bar Footer

```html
<ng-template gridFooterTemplate="completion" let-data="data">
  <div style="width: 100%;">
    <div style="
      background: #e0e0e0;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
    ">
      <div style="
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        height: 100%;
        width: {{ calculateCompletionPercentage(data) }}%;
        transition: width 0.3s ease;
      "></div>
    </div>
    <div style="font-size: 10px; color: #666; margin-top: 2px;">
      {{ calculateCompletionPercentage(data) }}% Complete
    </div>
  </div>
</ng-template>
```

### Example 3: Icon + Value Footer

```html
<ng-template gridFooterTemplate="status" let-data="data">
  <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
    </svg>
    <span style="font-weight: 600;">
      {{ countActive(data) }}/{{ data.length }} Active
    </span>
  </div>
</ng-template>
```

---

## 8. Package Hazırlığı İçin

Eğer grid'i npm package yapacaksan:

### Input Properties
```typescript
@Input() data: any[] = [];
@Input() columns: GridColumn[] = [];
@Input() config: GridConfig = {};
```

### Output Events
```typescript
@Output() dataStateChange = new EventEmitter<DataStateChangeEvent>();
@Output() onEdit = new EventEmitter<any>();
@Output() onDelete = new EventEmitter<any>();
```

### Content Templates
```typescript
@ContentChildren(GridCellTemplateDirective) cellTemplates!: QueryList<GridCellTemplateDirective>;
@ContentChildren(GridFooterTemplateDirective) footerTemplates!: QueryList<GridFooterTemplateDirective>;
@ContentChildren(GridHeaderTemplateDirective) headerTemplates!: QueryList<GridHeaderTemplateDirective>;
```

### Usage After Package
```bash
npm install @nlabs/angular-datagrid
```

```typescript
import { NlabsDataGridModule } from '@nlabs/angular-datagrid';

@NgModule({
  imports: [NlabsDataGridModule]
})
```

```html
<nlabs-data-grid
  [data]="data"
  [columns]="columns"
  [config]="config">
  
  <ng-template nlabsFooterTemplate="price" let-data="data">
    Total: ${{ calculateTotal(data, 'price') }}
  </ng-template>
  
</nlabs-data-grid>
```

---

## 9. Migration Guide

### From Hard-Coded Footer

**Before:**
```html
<!-- data-grid.html -->
<tfoot>
  <tr>
    <td>Total:</td>
    <td>{{ totalPrice }}</td>
  </tr>
</tfoot>
```

**After:**
```typescript
// grid-template.ts
columns: [
  {
    field: 'price',
    footerValue: (data) => {
      const total = data.reduce((sum, row) => sum + row.price, 0);
      return `Total: $${total}`;
    }
  }
]
```

### From Component Logic to Template

**Before:**
```typescript
// component.ts
getTotalPrice() {
  return this.data.reduce((sum, row) => sum + row.price, 0);
}
```

**After:**
```html
<!-- grid-template.html -->
<ng-template gridFooterTemplate="price" let-data="data">
  Total: ${{ calculateTotal(data, 'price') }}
</ng-template>
```

---

## 10. Conclusion

Footer yönetimi tamamen **template-based** ve **configurable**! 

Şu seçeneklere sahipsin:
1. ✅ **ng-template** - Tam HTML kontrolü
2. ✅ **footerValue function** - TypeScript hesaplama
3. ✅ **footerValue string** - Sabit değer
4. ✅ **aggregate** - Otomatik hesaplama (sum, avg, count, min, max)
5. ✅ **customAggregates** - Özel aggregate logic

Package yaparken bu yapı aynen çalışır! 🚀
