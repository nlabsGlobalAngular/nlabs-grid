# Advanced Customization Features

## Overview
Bu özellikler ile grid kolonlarını **veriyi değiştirmeden** tamamen özelleştirebilirsiniz. Satır numarası gösterme, header'lara ikon ekleme, cell içeriğini zenginleştirme gibi işlemler artık çok kolay!

## 1. 📊 INDEX Column (Satır Numarası)

### Problem
GUID, UUID veya kompleks ID'ler kullanıyorsanız, kullanıcı için anlamlı değil. Basit satır numarası göstermek istersiniz.

### Solution: `showIndex: true`

```typescript
{
  field: 'rowIndex', // Field adı önemsiz, showIndex=true olduğu için
  header: '#',
  showIndex: true, // ✨ Satır numarasını gösterir (1, 2, 3, ...)
  sortable: false,
  filterable: false,
  width: '60px',
  editable: false,
}
```

### Sonuç
```
# | ID                                    | Customer
--+--------------------------------------+----------
1 | 550e8400-e29b-41d4-a716-446655440000 | John
2 | 6ba7b810-9dad-11d1-80b4-00c04fd430c8 | Jane
3 | 7c9e6679-7425-40de-944b-e07fc1f90ae7 | Bob
```

### Özellikler
- ✅ 1-based index (1'den başlar)
- ✅ Pagination ile uyumlu (her sayfada 1'den başlar)
- ✅ Sorting/filtering'den etkilenmez
- ✅ Edit edilemez
- ❌ Sort edilemez (mantıksız olur)

---

## 2. 🎨 valueGetter - Veriyi Değiştirmeden Görünümü Özelleştir

### Problem
Database'deki veri `"France"` olsun. Ama UI'da `"🇫🇷 France"` göstermek istersin. Veriyi değiştirmek istemezsin (sorting/filtering bozulur).

### Solution: `valueGetter`

```typescript
{
  field: 'shipCountry',
  sortable: true,
  // valueGetter: Veriyi manipüle et (orijinal data değişmez!)
  valueGetter: (row: any, index: number) => {
    const flags: { [key: string]: string } = {
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Brazil': '🇧🇷',
    };
    return {
      flag: flags[row.shipCountry] || '🏳️',
      name: row.shipCountry
    };
  },
  // cellTemplate: valueGetter'dan gelen değeri göster
  cellTemplate: (value: any, row: any) => {
    return `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 20px;">${value.flag}</span>
        <span>${value.name}</span>
      </div>
    `;
  }
}
```

### Sonuç
```
Ship Country
------------
🇫🇷 France
🇩🇪 Germany
🇧🇷 Brazil
```

### Özellikler
- ✅ Orijinal data değişmez (sorting/filtering çalışır)
- ✅ Sadece görünüm değişir
- ✅ Row ve index parametresi alır
- ✅ Complex objeler döndürebilir
- ✅ cellTemplate ile birlikte kullanılır

### Kullanım Senaryoları

#### 1️⃣ Ülke Bayrakları
```typescript
valueGetter: (row: any) => ({
  flag: getCountryFlag(row.country),
  name: row.country
})
```

#### 2️⃣ Şirket Logoları/İkonları
```typescript
valueGetter: (row: any) => ({
  icon: '📦',
  name: row.company,
  color: getCompanyColor(row.company)
})
```

#### 3️⃣ Status Badge'leri
```typescript
valueGetter: (row: any) => ({
  icon: row.status === 'active' ? '✅' : '❌',
  text: row.status,
  color: row.status === 'active' ? '#10b981' : '#ef4444'
})
```

#### 4️⃣ User Avatars
```typescript
valueGetter: (row: any) => ({
  initials: row.name.split(' ').map(n => n[0]).join(''),
  name: row.name,
  avatar: row.avatarUrl
})
```

#### 5️⃣ Priority/Rating
```typescript
valueGetter: (row: any) => ({
  stars: '⭐'.repeat(row.rating),
  rating: row.rating
})
```

---

## 3. 🎯 headerContent - Header Customization

### Problem
Header'lara ikon, badge, tooltip eklemek istersin. Sadece text yeterli değil.

### Solution: `headerContent`

#### Option 1: Static HTML String
```typescript
{
  field: 'customer',
  headerContent: `
    <div style="display: flex; align-items: center; gap: 6px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <span>Müşteri Adı</span>
    </div>
  `,
}
```

#### Option 2: Dynamic Function
```typescript
{
  field: 'orderDate',
  headerContent: (column: GridColumn) => `
    <div style="display: flex; align-items: center; gap: 6px;">
      <svg>...</svg>
      <span>${column.field}</span>
      <span class="badge">New</span>
    </div>
  `,
}
```

### Sonuç
```
┌─────────────────────┬──────────────────────┐
│ 👤 Müşteri Adı      │ 📅 Order Date (NEW)  │
├─────────────────────┼──────────────────────┤
│ John Doe            │ 2024-01-15           │
└─────────────────────┴──────────────────────┘
```

### Özellikler
- ✅ HTML desteği (SVG, emoji, badge)
- ✅ Function veya string
- ✅ Inline CSS
- ✅ Dynamic content
- ⚠️ XSS riski - trusted content kullan!

### Kullanım Senaryoları

#### 1️⃣ Icon + Text
```typescript
headerContent: `
  <div style="display: flex; align-items: center; gap: 6px;">
    <svg>...</svg>
    <span>Customer Name</span>
  </div>
`
```

#### 2️⃣ Badge/Notification
```typescript
headerContent: `
  <div style="position: relative;">
    <span>Messages</span>
    <span style="
      position: absolute;
      top: -8px;
      right: -12px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">5</span>
  </div>
`
```

#### 3️⃣ Tooltip/Help Icon
```typescript
headerContent: `
  <div style="display: flex; align-items: center; gap: 6px;">
    <span>Status</span>
    <span title="Active/Inactive status of the user">❓</span>
  </div>
`
```

#### 4️⃣ Multi-line Header
```typescript
headerContent: `
  <div style="text-align: center;">
    <div style="font-weight: bold;">Total Sales</div>
    <div style="font-size: 10px; color: #666;">(Last 30 days)</div>
  </div>
`
```

#### 5️⃣ Dynamic Badge
```typescript
headerContent: (column: GridColumn) => {
  const isNew = column.field === 'newFeature';
  return `
    <div>
      ${column.header}
      ${isNew ? '<span class="badge-new">NEW</span>' : ''}
    </div>
  `;
}
```

---

## 4. 🔥 Complete Examples

### Example 1: User Table with Avatars

```typescript
columns: GridColumn[] = [
  // Index column
  {
    field: 'index',
    header: '#',
    showIndex: true,
    width: '50px',
  },
  // User with avatar
  {
    field: 'user',
    headerContent: `
      <div style="display: flex; align-items: center; gap: 6px;">
        <svg>👤</svg>
        <span>User</span>
      </div>
    `,
    valueGetter: (row) => ({
      initials: row.name.split(' ').map(n => n[0]).join(''),
      name: row.name,
      email: row.email
    }),
    cellTemplate: (value) => `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        ">${value.initials}</div>
        <div>
          <div style="font-weight: 600;">${value.name}</div>
          <div style="font-size: 12px; color: #666;">${value.email}</div>
        </div>
      </div>
    `
  },
  // Status with icon
  {
    field: 'status',
    headerContent: '📊 Status',
    valueGetter: (row) => ({
      icon: row.status === 'active' ? '✅' : '❌',
      text: row.status,
      color: row.status === 'active' ? '#10b981' : '#ef4444'
    }),
    cellTemplate: (value) => `
      <span style="
        background: ${value.color}15;
        color: ${value.color};
        padding: 4px 12px;
        border-radius: 6px;
        font-weight: 600;
      ">
        ${value.icon} ${value.text}
      </span>
    `
  }
];
```

### Example 2: E-commerce Orders Table

```typescript
columns: GridColumn[] = [
  // Row number
  {
    field: 'rowNum',
    header: '#',
    showIndex: true,
    width: '50px',
  },
  // Product with image
  {
    field: 'product',
    headerContent: '🛒 Product',
    valueGetter: (row) => ({
      name: row.productName,
      sku: row.sku,
      image: row.imageUrl
    }),
    cellTemplate: (value) => `
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="${value.image}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
        <div>
          <div style="font-weight: 600;">${value.name}</div>
          <div style="font-size: 11px; color: #999;">SKU: ${value.sku}</div>
        </div>
      </div>
    `
  },
  // Price with currency
  {
    field: 'price',
    headerContent: '💰 Price',
    valueGetter: (row) => ({
      amount: row.price,
      currency: row.currency || 'USD'
    }),
    cellTemplate: (value) => `
      <span style="font-weight: 600; color: #059669;">
        ${value.currency} ${value.amount.toFixed(2)}
      </span>
    `
  },
  // Shipping country with flag
  {
    field: 'country',
    headerContent: '🌍 Country',
    valueGetter: (row) => ({
      flag: getCountryFlag(row.country),
      name: row.country
    }),
    cellTemplate: (value) => `
      <div>
        <span style="font-size: 20px;">${value.flag}</span>
        ${value.name}
      </div>
    `
  }
];
```

### Example 3: Analytics Dashboard

```typescript
columns: GridColumn[] = [
  // Metric name with icon
  {
    field: 'metric',
    headerContent: (col) => `
      <div>
        <div style="font-weight: bold;">📈 Metric</div>
        <div style="font-size: 10px; color: #666;">Last updated: ${new Date().toLocaleDateString()}</div>
      </div>
    `,
  },
  // Value with trend indicator
  {
    field: 'value',
    headerContent: '💹 Current Value',
    valueGetter: (row) => ({
      value: row.current,
      previous: row.previous,
      trend: row.current > row.previous ? 'up' : 'down',
      percentage: ((row.current - row.previous) / row.previous * 100).toFixed(1)
    }),
    cellTemplate: (value) => `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px; font-weight: bold;">${value.value}</span>
        <span style="
          color: ${value.trend === 'up' ? '#10b981' : '#ef4444'};
          font-size: 12px;
          font-weight: 600;
        ">
          ${value.trend === 'up' ? '↗' : '↘'} ${value.percentage}%
        </span>
      </div>
    `
  }
];
```

---

## 5. ⚙️ Technical Details

### Interface Updates

```typescript
export interface GridColumn {
  // ... existing properties
  
  // NEW: Show row index instead of field value
  showIndex?: boolean;
  
  // NEW: Custom value getter - manipulate data before display
  valueGetter?: (row: any, index: number) => any;
  
  // NEW: Custom header content (HTML supported)
  headerContent?: string | ((column: GridColumn) => string);
}
```

### Method Signatures

```typescript
// Get cell value with index support
getCellValue(row: any, column: GridColumn, rowIndex?: number): any

// Get header content (string or function)
getHeaderContent(column: GridColumn): string
```

### HTML Rendering

```html
<!-- Header with custom content -->
<th>
  @if (column.headerContent) {
    <span [innerHTML]="getHeaderContent(column)"></span>
  } @else {
    <span>{{ column.header }}</span>
  }
</th>

<!-- Cell with valueGetter support -->
<td>
  <span>{{ formatCellValue(getCellValue(item, column, i), column) }}</span>
</td>
```

---

## 6. 🎓 Best Practices

### ✅ DO

1. **Use showIndex for row numbers**
   ```typescript
   { field: 'rowNum', header: '#', showIndex: true, width: '50px' }
   ```

2. **Use valueGetter to enrich display data**
   ```typescript
   valueGetter: (row) => ({ ...row.data, displayInfo: extraInfo })
   ```

3. **Keep headers clean and informative**
   ```typescript
   headerContent: '<svg>...</svg> Customer Name'
   ```

4. **Use cellTemplate with valueGetter**
   ```typescript
   valueGetter: (row) => enrichData(row),
   cellTemplate: (value) => renderRichContent(value)
   ```

### ❌ DON'T

1. **Don't modify original data in valueGetter**
   ```typescript
   // ❌ BAD
   valueGetter: (row) => {
     row.country = 'Modified'; // Don't mutate!
     return row.country;
   }
   
   // ✅ GOOD
   valueGetter: (row) => {
     return { ...row, extra: 'data' }; // Return new object
   }
   ```

2. **Don't put complex logic in headerContent function**
   ```typescript
   // ❌ BAD
   headerContent: (col) => {
     // Heavy computation, API calls, etc.
     return heavyComputation();
   }
   
   // ✅ GOOD
   headerContent: (col) => `${col.header} ${badge}`
   ```

3. **Don't use showIndex for editable columns**
   ```typescript
   // ❌ BAD
   { field: 'id', showIndex: true, editable: true }
   
   // ✅ GOOD
   { field: 'id', showIndex: true, editable: false }
   ```

4. **Don't forget XSS protection**
   ```typescript
   // ⚠️ DANGER: User input in headerContent
   headerContent: userInput // Can contain <script> tags!
   
   // ✅ SAFE: Sanitized or trusted content only
   headerContent: sanitize(userInput)
   ```

---

## 7. 📊 Comparison Table

| Feature | Before | After |
|---------|--------|-------|
| **Row Index** | Create computed field in data | `showIndex: true` |
| **Custom Display** | Modify actual data | `valueGetter: (row) => ...` |
| **Header Icon** | Not possible | `headerContent: '<svg>...'` |
| **Data Integrity** | Data gets mutated | Data stays pure |
| **Complexity** | High (data transformation) | Low (display transformation) |

---

## 8. 🚀 Migration Guide

### Upgrading Existing Code

#### Before (Old Way)
```typescript
// Modifying data
this.data = this.data.map((item, index) => ({
  ...item,
  rowNumber: index + 1,
  countryDisplay: `${getFlag(item.country)} ${item.country}`,
  customerDisplay: `<img> ${item.customer}`
}));

columns = [
  { field: 'rowNumber', header: '#' },
  { field: 'countryDisplay', header: 'Country' },
  { field: 'customerDisplay', header: 'Customer' }
];
```

#### After (New Way)
```typescript
// Data stays pure
this.data = [...originalData];

columns = [
  { 
    field: 'rowNum', 
    header: '#', 
    showIndex: true 
  },
  { 
    field: 'country',
    headerContent: '🌍 Country',
    valueGetter: (row) => ({
      flag: getFlag(row.country),
      name: row.country
    }),
    cellTemplate: (value) => `${value.flag} ${value.name}`
  },
  { 
    field: 'customer',
    valueGetter: (row) => row.customer,
    cellTemplate: (value) => `<img> ${value}`
  }
];
```

### Benefits of Migration
- ✅ Cleaner data structure
- ✅ Better performance (no data mutation)
- ✅ Easier debugging
- ✅ Better TypeScript support
- ✅ Sorting/filtering works correctly

---

## 9. 💡 Tips & Tricks

### Tip 1: Combine Multiple Features
```typescript
{
  field: 'status',
  showIndex: false,
  headerContent: '📊 Status <span class="badge">Live</span>',
  valueGetter: (row, index) => ({
    status: row.status,
    rowNum: index + 1,
    icon: getStatusIcon(row.status)
  }),
  cellTemplate: (value) => `
    #${value.rowNum}: ${value.icon} ${value.status}
  `
}
```

### Tip 2: Reusable Value Getters
```typescript
// Create reusable functions
const countryValueGetter = (row: any) => ({
  flag: getCountryFlag(row.country),
  name: row.country
});

const statusValueGetter = (row: any) => ({
  icon: row.active ? '✅' : '❌',
  text: row.active ? 'Active' : 'Inactive',
  color: row.active ? '#10b981' : '#ef4444'
});

// Use in columns
columns = [
  { field: 'country', valueGetter: countryValueGetter },
  { field: 'status', valueGetter: statusValueGetter }
];
```

### Tip 3: Conditional Header Content
```typescript
headerContent: (column: GridColumn) => {
  const hasFilter = this.activeFilters.includes(column.field);
  return `
    ${column.header}
    ${hasFilter ? '<span class="filter-badge">🔍</span>' : ''}
  `;
}
```

### Tip 4: Performance Optimization
```typescript
// ❌ Slow: Heavy computation in valueGetter (called for every row)
valueGetter: (row) => {
  const result = heavyComputation(row); // Slow!
  return result;
}

// ✅ Fast: Pre-compute once
ngOnInit() {
  this.enrichedData = this.data.map(row => ({
    ...row,
    computed: heavyComputation(row)
  }));
}

valueGetter: (row) => row.computed // Fast lookup!
```

---

## 10. 🎯 Conclusion

These three features work together to give you complete control over your grid's appearance without compromising data integrity:

1. **`showIndex`** - Perfect for row numbers when IDs are meaningless
2. **`valueGetter`** - Transform data for display without mutation
3. **`headerContent`** - Rich header customization with HTML support

**Remember:** 
- Keep data pure 🧊
- Transform for display only 🎨
- Use TypeScript for safety 🛡️

Happy coding! 🚀
