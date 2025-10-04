# Template-Based Cell Customization Guide

Bu dokümantasyon, Angular Data Grid'de **ng-template** kullanarak **custom cell** ve **footer** oluşturmayı açıklamaktadır.

## 🎯 Neden Template-Based Yaklaşım?

### Function-Based (Eski Yöntem)
```typescript
{
  field: 'customer',
  cellTemplate: (value, row) => `<span>${value}</span>` // String döner
}
```

### Template-Based (Yeni Yöntem) ✨
```html
<app-data-grid [data]="gridData" [columns]="columns">
  <ng-template gridCellTemplate="customer" let-row let-column="column">
    <span>{{ row.customer }}</span>
  </ng-template>
</app-data-grid>
```

**Avantajlar:**
- ✅ Angular binding desteği (`[(ngModel)]`, `(click)`, `*ngIf`)
- ✅ Component injection (servisler, pipe'lar)
- ✅ Type safety
- ✅ Daha kolay debug
- ✅ Component methodlarına erişim
- ✅ Daha temiz HTML

---

## 📝 Temel Kullanım

### 1. Custom Cell Template

```html
<app-data-grid [data]="gridData" [columns]="columns">
  <!-- Field adı ile template bağlantısı -->
  <ng-template gridCellTemplate="customer" let-row let-column="column">
    <!-- row: Tüm satır verisi -->
    <!-- column: Kolon bilgisi -->
    <div>{{ row.customer }}</div>
  </ng-template>
</app-data-grid>
```

**Önemli:**
- `gridCellTemplate="customer"` → `customer` field'ına uygulanır
- `let-row` → Satır verisine erişim
- `let-column="column"` → Kolon konfigürasyonuna erişim

---

### 2. Custom Footer Template

```html
<app-data-grid [data]="gridData" [columns]="columns" [config]="{showFooter: true}">
  <!-- Field adı ile footer template bağlantısı -->
  <ng-template gridFooterTemplate="freight" let-data="data" let-column="column">
    <!-- data: Tüm satır verileri (displayData) -->
    <!-- column: Kolon bilgisi -->
    <div>Total: {{ calculateTotal(data) }}</div>
  </ng-template>
</app-data-grid>
```

**Önemli:**
- `gridFooterTemplate="freight"` → `freight` field'ına uygulanır
- `let-data="data"` → Tüm görünen satır verilerine erişim
- `let-column="column"` → Kolon konfigürasyonuna erişim

---

## 🎨 Gelişmiş Örnekler

### Örnek 1: Avatar + İsim (Customer)

```html
<ng-template gridCellTemplate="customer" let-row>
  <div style="display: flex; align-items: center; gap: 8px;">
    <!-- Avatar Circle -->
    <span style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
    ">
      {{ row.customer.charAt(0) }}
    </span>
    
    <!-- Customer Name -->
    <span style="font-weight: 600; color: var(--text-primary);">
      {{ row.customer }}
    </span>
  </div>
</ng-template>
```

**Sonuç:**
```
[A]  Alfreds Futterkiste
```

---

### Örnek 2: Icon + Value (Freight)

```html
<ng-template gridCellTemplate="freight" let-row>
  <div style="display: flex; align-items: center; gap: 8px;">
    <!-- Warning Icon (>$100) -->
    @if (row.freight > 100) {
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    } 
    <!-- Info Icon ($50-$100) -->
    @else if (row.freight > 50) {
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    } 
    <!-- Check Icon (<$50) -->
    @else {
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    }
    
    <!-- Colored Value -->
    <span [style.color]="row.freight > 100 ? '#ef4444' : row.freight > 50 ? '#f59e0b' : '#10b981'"
          [style.font-weight]="'700'">
      ${{ row.freight.toFixed(2) }}
    </span>
  </div>
</ng-template>
```

**Sonuç:**
```
⚠️ $132.50  (kırmızı)
ℹ️ $78.20   (turuncu)
✓  $42.10   (yeşil)
```

---

### Örnek 3: Multi-Line Footer (Freight)

```html
<ng-template gridFooterTemplate="freight" let-data="data">
  <div style="
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 12px;
  ">
    <!-- Total -->
    <div style="font-weight: 700; color: var(--primary-color);">
      Total: ${{ calculateTotal(data, 'freight') }}
    </div>
    
    <!-- Average -->
    <div style="color: var(--text-secondary);">
      Avg: ${{ calculateAverage(data, 'freight') }}
    </div>
  </div>
</ng-template>
```

**Component Method:**
```typescript
calculateTotal(data: any[], field: string): string {
  const total = data.reduce((sum, row) => sum + (row[field] || 0), 0);
  return total.toFixed(2);
}

calculateAverage(data: any[], field: string): string {
  if (data.length === 0) return '0.00';
  const total = data.reduce((sum, row) => sum + (row[field] || 0), 0);
  return (total / data.length).toFixed(2);
}
```

**Sonuç:**
```
Total: $1,245.80
Avg: $124.58
```

---

### Örnek 4: Badge Footer (Customer)

```html
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
```

**Sonuç:**
```
╔════════════════╗
║ 25 Customers   ║
╚════════════════╝
```

---

## 🔧 Component Setup

### 1. Directive Import

```typescript
import { GridCellTemplateDirective } from '../data-grid/directives/grid-cell-template.directive';
import { GridFooterTemplateDirective } from '../data-grid/directives/grid-footer-template.directive';

@Component({
  selector: 'app-grid-template',
  imports: [DataGrid, GridCellTemplateDirective, GridFooterTemplateDirective],
  templateUrl: './grid-template.html',
  styleUrl: './grid-template.css'
})
export class GridTemplate {
  // ...
}
```

### 2. Helper Methods

```typescript
export class GridTemplate {
  // Total calculation
  calculateTotal(data: any[], field: string): string {
    const total = data.reduce((sum, row) => sum + (row[field] || 0), 0);
    return total.toFixed(2);
  }

  // Average calculation
  calculateAverage(data: any[], field: string): string {
    if (data.length === 0) return '0.00';
    const total = data.reduce((sum, row) => sum + (row[field] || 0), 0);
    return (total / data.length).toFixed(2);
  }

  // Count unique values
  countUnique(data: any[], field: string): number {
    return new Set(data.map(row => row[field])).size;
  }
}
```

---

## 🎯 Full Example

### Template (grid-template.html)

```html
<app-data-grid
    [data]="gridData"
    [columns]="columns"
    [config]="gridConfig"
    [theme]="'auto'"
>
  <!-- Customer Cell: Avatar + Name -->
  <ng-template gridCellTemplate="customer" let-row>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      ">
        {{ row.customer.charAt(0) }}
      </span>
      <span style="font-weight: 600;">{{ row.customer }}</span>
    </div>
  </ng-template>

  <!-- Freight Cell: Icon + Value -->
  <ng-template gridCellTemplate="freight" let-row>
    <div style="display: flex; align-items: center; gap: 8px;">
      @if (row.freight > 100) {
        <svg width="16" height="16" fill="none" stroke="#ef4444" stroke-width="2">
          <circle cx="8" cy="8" r="7"/>
          <line x1="8" y1="4" x2="8" y2="8"/>
        </svg>
      }
      <span [style.color]="row.freight > 100 ? '#ef4444' : '#10b981'">
        ${{ row.freight.toFixed(2) }}
      </span>
    </div>
  </ng-template>

  <!-- Freight Footer: Total + Average -->
  <ng-template gridFooterTemplate="freight" let-data="data">
    <div>
      <div style="font-weight: 700; color: var(--primary-color);">
        Total: ${{ calculateTotal(data, 'freight') }}
      </div>
      <div style="color: var(--text-secondary); font-size: 11px;">
        Avg: ${{ calculateAverage(data, 'freight') }}
      </div>
    </div>
  </ng-template>

  <!-- Customer Footer: Count Badge -->
  <ng-template gridFooterTemplate="customer" let-data="data">
    <div style="
      background: #667eea20;
      padding: 6px 12px;
      border-radius: 6px;
      color: #667eea;
      font-weight: 600;
    ">
      {{ data.length }} Customers
    </div>
  </ng-template>
</app-data-grid>
```

### Component (grid-template.ts)

```typescript
import { Component } from '@angular/core';
import { DataGrid } from '../data-grid/data-grid';
import { GridCellTemplateDirective } from '../data-grid/directives/grid-cell-template.directive';
import { GridFooterTemplateDirective } from '../data-grid/directives/grid-footer-template.directive';

@Component({
  selector: 'app-grid-template',
  imports: [DataGrid, GridCellTemplateDirective, GridFooterTemplateDirective],
  templateUrl: './grid-template.html'
})
export class GridTemplate {
  gridData = [ /* ... */ ];
  columns = [ /* ... */ ];
  
  gridConfig = {
    showFooter: true,  // Enable custom footer
    // ... other config
  };

  calculateTotal(data: any[], field: string): string {
    return data.reduce((sum, row) => sum + (row[field] || 0), 0).toFixed(2);
  }

  calculateAverage(data: any[], field: string): string {
    if (!data.length) return '0.00';
    const total = data.reduce((sum, row) => sum + (row[field] || 0), 0);
    return (total / data.length).toFixed(2);
  }
}
```

---

## 🆚 Karşılaştırma

### Function-Based vs Template-Based

| Özellik | Function-Based | Template-Based |
|---------|---------------|----------------|
| **Syntax** | TypeScript function | Angular template |
| **Binding** | ❌ String return | ✅ Full Angular binding |
| **Components** | ❌ Kullanılamaz | ✅ Component injection |
| **Event Handling** | ❌ Manuel | ✅ `(click)`, `(change)` |
| **Type Safety** | ⚠️ Kısıtlı | ✅ Full type checking |
| **Debug** | ⚠️ String içinde | ✅ Chrome DevTools |
| **Pipes** | ❌ Manuel | ✅ `{{ value \| date }}` |
| **Directives** | ❌ Kullanılamaz | ✅ `*ngIf`, `*ngFor` |
| **Performance** | ⚡ Hafif | ⚡ Angular optimized |

---

## 💡 Best Practices

### 1. Field Adı Doğru Olmalı
```html
<!-- ✅ Doğru -->
<ng-template gridCellTemplate="customer" let-row>
  {{ row.customer }}
</ng-template>

<!-- ❌ Yanlış -->
<ng-template gridCellTemplate="customerName" let-row>
  {{ row.customer }}  <!-- Field adı eşleşmiyor -->
</ng-template>
```

### 2. let-row ile Satır Erişimi
```html
<!-- ✅ Doğru -->
<ng-template gridCellTemplate="freight" let-row>
  {{ row.freight }}
</ng-template>

<!-- ❌ Yanlış -->
<ng-template gridCellTemplate="freight">
  {{ freight }}  <!-- row kullanılmadı -->
</ng-template>
```

### 3. Footer için let-data Kullan
```html
<!-- ✅ Doğru -->
<ng-template gridFooterTemplate="freight" let-data="data">
  Total: {{ calculateTotal(data, 'freight') }}
</ng-template>

<!-- ❌ Yanlış -->
<ng-template gridFooterTemplate="freight" let-row>
  Total: {{ calculateTotal(row, 'freight') }}  <!-- data değil row -->
</ng-template>
```

### 4. Helper Methods Component'te Tanımlı Olmalı
```typescript
// ✅ Doğru
export class GridTemplate {
  calculateTotal(data: any[], field: string): string {
    return data.reduce((sum, row) => sum + (row[field] || 0), 0).toFixed(2);
  }
}
```

```html
<ng-template gridFooterTemplate="freight" let-data="data">
  Total: ${{ calculateTotal(data, 'freight') }}
</ng-template>
```

---

## 🎨 Styling Tips

### 1. CSS Variables Kullan
```html
<span style="color: var(--primary-color);">
  {{ value }}
</span>
```

### 2. Theme-Aware Styling
```html
<div [style.color]="row.value > 100 ? '#ef4444' : 'var(--text-primary)'">
  {{ row.value }}
</div>
```

### 3. Responsive Design
```html
<div style="
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
">
  <!-- Content -->
</div>
```

---

## 🚀 Gelişmiş Senaryolar

### 1. Click Event Handling
```html
<ng-template gridCellTemplate="customer" let-row>
  <button (click)="onCustomerClick(row)" 
          style="background: none; border: none; cursor: pointer;">
    {{ row.customer }}
  </button>
</ng-template>
```

```typescript
onCustomerClick(row: any) {
  console.log('Customer clicked:', row);
  // Navigate to detail page, open modal, etc.
}
```

### 2. Conditional Rendering
```html
<ng-template gridCellTemplate="status" let-row>
  @if (row.status === 'active') {
    <span style="color: #10b981;">✓ Active</span>
  } @else if (row.status === 'pending') {
    <span style="color: #f59e0b;">⏳ Pending</span>
  } @else {
    <span style="color: #ef4444;">✗ Inactive</span>
  }
</ng-template>
```

### 3. Editable Cells
```html
<ng-template gridCellTemplate="price" let-row>
  @if (editingRow === row) {
    <input type="number" 
           [(ngModel)]="row.price"
           (blur)="saveEdit(row)"
           style="width: 100%; padding: 4px;">
  } @else {
    <span (dblclick)="startEdit(row)">
      ${{ row.price.toFixed(2) }}
    </span>
  }
</ng-template>
```

---

## 📞 Destek

- **Live Demo:** http://localhost:4200
- **Documentation:** CUSTOM-CELLS-FOOTER.md
- **GitHub:** Issues & Discussions

---

**Son Güncelleme:** 4 Ekim 2025  
**Versiyon:** 2.0.0 (Template-Based)
