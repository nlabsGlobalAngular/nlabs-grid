# Custom Cell Templates & Footer Configuration Guide

Bu dokümantasyon, Angular Data Grid'de **özel hücre şablonları (custom cell templates)** ve **footer konfigürasyonu** özelliklerini açıklamaktadır.

## 📋 İçindekiler

1. [Custom Cell Templates](#custom-cell-templates)
2. [Cell Styling](#cell-styling)
3. [Footer Configuration](#footer-configuration)
4. [Örnekler](#örnekler)

---

## 🎨 Custom Cell Templates

### cellTemplate
Her hücre için özel HTML render edebilirsiniz:

```typescript
{
  field: 'customer',
  header: 'Customer',
  cellTemplate: (value: string, row: any) => {
    return `<span style="
      background: #3b82f620;
      color: #3b82f6;
      padding: 4px 12px;
      border-radius: 6px;
      font-weight: 600;
    ">${value}</span>`;
  }
}
```

**Parametreler:**
- `value`: Hücrenin değeri
- `row`: Tüm satır verisi
- **Return:** HTML string

**Kullanım Alanları:**
- Badge/etiket gösterimleri
- İkonlar ve emoji
- Özel formatlama
- Renkli değerler
- Progress bar'lar

---

## 🎯 Cell Styling

### cellClass
Hücreye dinamik CSS class ekleyin:

```typescript
{
  field: 'freight',
  header: 'Freight',
  cellClass: (row: any) => {
    const value = row.freight;
    if (value > 100) return 'high-value';
    if (value > 50) return 'medium-value';
    return 'low-value';
  }
}
```

**Parametreler:**
- `row`: Satır verisi
- **Return:** CSS class adı (string)

**Örnek CSS:**
```css
.high-value {
  font-weight: 700;
  animation: pulse 2s infinite;
}

.medium-value {
  font-weight: 600;
}

.low-value {
  font-weight: 500;
}
```

---

### cellStyle
Hücreye inline style ekleyin:

```typescript
{
  field: 'freight',
  header: 'Freight',
  cellStyle: (row: any) => {
    const value = row.freight;
    if (value > 100) {
      return { 
        'background': 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
        'font-weight': 'bold'
      };
    }
    if (value > 50) {
      return { 
        'background': 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        'font-weight': '600'
      };
    }
    return { 
      'background': 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      'font-weight': '600'
    };
  }
}
```

**Parametreler:**
- `row`: Satır verisi
- **Return:** Style object `{ [key: string]: string }`

**Kullanım Alanları:**
- Conditional formatting
- Gradient backgrounds
- Dinamik renkler
- Font stilleri
- Kenarlıklar ve padding

---

## 📊 Footer Configuration

### showFooter
Grid'de custom footer göstermek için:

```typescript
gridConfig: GridConfig = {
  showFooter: true,  // Footer'ı aktif et
  footerClass: 'custom-footer-style',  // Özel CSS class
  // ... diğer config
}
```

---

### footerValue (Column Level)
Her kolon için özel footer değeri:

```typescript
{
  field: 'freight',
  header: 'Freight',
  footerValue: (data: any[]) => {
    const total = data.reduce((sum, row) => sum + (row.freight || 0), 0);
    const avg = total / data.length;
    return `Total: $${total.toFixed(2)} | Avg: $${avg.toFixed(2)}`;
  }
}
```

**Parametreler:**
- `data`: Tüm satır verileri (displayData)
- **Return:** String değer

**Kullanım Alanları:**
- Toplam (Total)
- Ortalama (Average)
- Sayım (Count)
- Min/Max değerler
- Özel hesaplamalar

---

### customAggregates (Grid Level)
Grid config'de genel aggregate fonksiyonları:

```typescript
gridConfig: GridConfig = {
  showFooter: true,
  customAggregates: {
    // OrderDate için özel hesaplama
    orderDate: (data: any[]) => {
      const dates = data.map(row => new Date(row.orderDate))
                        .sort((a, b) => a.getTime() - b.getTime());
      const oldest = dates[0].toLocaleDateString();
      const newest = dates[dates.length - 1].toLocaleDateString();
      return `${oldest} - ${newest}`;
    },
    
    // ShipCountry için benzersiz sayım
    shipCountry: (data: any[]) => {
      const uniqueCountries = new Set(data.map(row => row.shipCountry));
      return `${uniqueCountries.size} Countries`;
    }
  }
}
```

**Kullanım Alanları:**
- Tarih aralıkları
- Benzersiz değer sayımı
- Karmaşık hesaplamalar
- İstatistiksel analizler

---

## 💡 Örnekler

### Örnek 1: Freight Kolonu (Full Featured)

```typescript
{
  field: 'freight',
  header: 'Freight',
  sortable: true,
  filterable: true,
  type: 'number',
  width: '120px',
  aggregate: 'sum',  // Summary row için
  format: (value) => `$${value?.toFixed(2)}`,
  
  // Custom cell template
  cellTemplate: (value: number, row: any) => {
    const color = value > 100 ? '#ef4444' : value > 50 ? '#f59e0b' : '#10b981';
    return `<span style="color: ${color}; font-weight: 600;">$${value.toFixed(2)}</span>`;
  },
  
  // Dynamic cell class
  cellClass: (row: any) => {
    const value = row.freight;
    if (value > 100) return 'high-value';
    if (value > 50) return 'medium-value';
    return 'low-value';
  },
  
  // Dynamic cell style
  cellStyle: (row: any) => {
    const value = row.freight;
    if (value > 100) {
      return { 
        'background': 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
        'font-weight': 'bold'
      };
    }
    if (value > 50) {
      return { 
        'background': 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        'font-weight': '600'
      };
    }
    return { 
      'background': 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      'font-weight': '600'
    };
  },
  
  // Custom footer calculation
  footerValue: (data: any[]) => {
    const total = data.reduce((sum, row) => sum + (row.freight || 0), 0);
    const avg = total / data.length;
    return `Total: $${total.toFixed(2)} | Avg: $${avg.toFixed(2)}`;
  }
}
```

---

### Örnek 2: Customer Kolonu (Badge Style)

```typescript
{
  field: 'customer',
  header: 'Customer',
  sortable: true,
  filterable: true,
  width: '200px',
  
  // Badge style template
  cellTemplate: (value: string, row: any) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const color = colors[value.length % colors.length];
    return `<span style="
      background: ${color}20;
      color: ${color};
      padding: 4px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
      border: 1px solid ${color}40;
    ">${value}</span>`;
  }
}
```

---

### Örnek 3: Shipping Company (Footer Count)

```typescript
{
  field: 'shippingCompany',
  header: 'Shipping Company',
  sortable: true,
  filterable: true,
  width: '180px',
  
  // Benzersiz company sayısını göster
  footerValue: (data: any[]) => {
    const uniqueCompanies = new Set(data.map(row => row.shippingCompany));
    return `${uniqueCompanies.size} Companies`;
  }
}
```

---

### Örnek 4: Grid Config (Full Setup)

```typescript
gridConfig: GridConfig = {
  // Normal features
  pageable: true,
  sortable: true,
  filterable: true,
  showSummary: true,  // Standard summary row
  
  // Footer configuration
  showFooter: true,    // Custom footer
  footerClass: 'custom-footer-style',
  customAggregates: {
    orderDate: (data: any[]) => {
      const dates = data.map(row => new Date(row.orderDate))
                        .sort((a, b) => a.getTime() - b.getTime());
      return `${dates[0].toLocaleDateString()} - ${dates[dates.length - 1].toLocaleDateString()}`;
    },
    shipCountry: (data: any[]) => {
      const uniqueCountries = new Set(data.map(row => row.shipCountry));
      return `${uniqueCountries.size} Countries`;
    }
  }
}
```

---

## 🎨 CSS Customization

Footer için custom CSS:

```css
/* Custom footer styling */
.custom-footer-style {
  font-family: 'Courier New', monospace;
  border-top: 4px double var(--primary-color);
}

.custom-footer-style .footer-value {
  font-size: 13px;
  letter-spacing: 1px;
}

/* High value animation */
.high-value {
  font-weight: 700;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
```

---

## 📝 Notlar

### cellTemplate vs template
- **cellTemplate**: Function-based, inline HTML string döner
- **template**: Angular TemplateRef, daha kompleks senaryolar için

### showSummary vs showFooter
- **showSummary**: Standard aggregate row (sum, avg, count, min, max)
- **showFooter**: Fully customizable footer row

### Performance
- cellTemplate her render'da çalışır
- Karmaşık hesaplamalar için memoization kullanın
- Heavy DOM manipülasyonlarından kaçının

---

## 🚀 Gelişmiş Özellikler

### Koşullu Footer Görünümü
```typescript
footerValue: (data: any[]) => {
  if (data.length === 0) return 'No Data';
  if (data.length < 10) return `Only ${data.length} records`;
  
  const total = data.reduce((sum, row) => sum + row.freight, 0);
  return `Total: $${total.toFixed(2)} (${data.length} records)`;
}
```

### Multi-line Footer
```typescript
footerValue: (data: any[]) => {
  const total = data.reduce((sum, row) => sum + row.freight, 0);
  const avg = total / data.length;
  const max = Math.max(...data.map(row => row.freight));
  return `Tot: $${total.toFixed(2)}<br>Avg: $${avg.toFixed(2)}<br>Max: $${max.toFixed(2)}`;
}
```

### Progress Bar in Cell
```typescript
cellTemplate: (value: number, row: any) => {
  const percentage = (value / 200) * 100;
  return `
    <div style="width: 100%; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
      <div style="
        width: ${percentage}%;
        background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 11px;
      ">
        ${percentage.toFixed(0)}%
      </div>
    </div>
  `;
}
```

---

## 📞 Destek

Sorularınız için:
- GitHub Issues
- Documentation: README.md
- Live Demo: http://localhost:4200

---

**Son Güncelleme:** 4 Ekim 2025
**Versiyon:** 1.0.0
