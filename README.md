# 🚀 @nlabs/grid - Angular Advanced DataGrid Component

<div align="center">

![Angular](https://img.shields.io/badge/Angular-20.0.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

**Enterprise-grade DataGrid component with advanced features, dual edit modes, and beautiful dark/light themes**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
  - [Grid Width](#-grid-width-configuration)
  - [Theme System](#-theme-system)
  - [CRUD Operations](#-crud-operations)
  - [Advanced Features](#-advanced-features)
- [API Reference](#-api-reference)
- [Examples](#-examples)
- [Browser Support](#-browser-support)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

### Core Features
- ✅ **Fully Customizable Width** - Set grid width via component inputs (`width`, `maxWidth`)
- 🎨 **Advanced Theme System** - Light, Dark, and Auto modes with smooth transitions
- 📱 **Responsive Design** - Mobile-friendly with adaptive layouts
- ⚡ **High Performance** - Optimized rendering for large datasets
- 🎯 **TypeScript Support** - Full type safety and IntelliSense

### Data Management
- 🔍 **Global Search** - Search across all columns instantly
- 🔀 **Multi-Column Sorting** - Sort by multiple columns
- 🎯 **Advanced Filtering** - Multiple filter operators (equals, contains, starts with, etc.)
- 📊 **Grouping** - Group data by any column
- 📄 **Pagination** - Customizable page sizes (10, 25, 50, 100)
- 📈 **Summary Row** - Calculate totals, averages, counts

### Editing Capabilities
- ✏️ **Dual Edit Modes**
  - **Inline Editing** - Quick edit directly in table row
  - **Modal Editing** - Detailed form in modal overlay
- ➕ **Add Records** - Modal form for new records
- 🗑️ **Delete Confirmation** - Beautiful confirmation modal with record details
- 💾 **Auto-Save** - Configurable auto-save on edit

### Export & Import
- 📤 **Multiple Export Formats**
  - Excel (.xlsx)
  - CSV (.csv)
  - PDF (.pdf)
  - JSON (.json)
- 📥 **Import Support** - Import from Excel/CSV

### UI/UX Features
- 🎭 **Custom Cell Templates** - Define custom rendering for any column
- 🎨 **Custom Footer Templates** - Show calculations in footer
- 🎪 **Column Menu** - Show/hide columns, reorder, resize
- 🔄 **Column Reordering** - Drag & drop columns
- 📏 **Column Resizing** - Adjust column widths
- 🎯 **Row Selection** - Single/Multi row selection
- 🌈 **Beautiful Animations** - Smooth transitions and effects

---

## 🎬 Demo

### Light Theme
![Light Theme Demo](docs/images/light-theme.png)

### Dark Theme
![Dark Theme Demo](docs/images/dark-theme.png)

### Dual Edit Modes
![Edit Modes Demo](docs/images/edit-modes.gif)

### Live Demo
🔗 **[View Live Demo](https://your-demo-url.com)** (Coming soon)

---

## 📦 Installation

### Prerequisites
- Node.js >= 18.x
- Angular >= 18.x
- npm or yarn

### Install via NPM
```bash
npm install @nlabs/grid
```

### Install via Yarn
```bash
yarn add @nlabs/grid
```

### Or Clone Repository
```bash
git clone https://github.com/nlabsGlobalAngular/nlabs-grid.git
cd nlabs-grid
npm install
```

### Run Development Server
```bash
npm start
# or
ng serve
```

Open your browser and navigate to `http://localhost:4200/`

---

## 🚀 Quick Start

### 1. Import the DataGrid Component

```typescript
import { Component } from '@angular/core';
import { DataGrid } from '@nlabs/grid';
import { GridColumn } from '@nlabs/grid/interfaces';

@Component({
  selector: 'app-my-grid',
  imports: [DataGrid],
  template: `
    <app-data-grid
        [data]="gridData"
        [columns]="columns"
        [theme]="'auto'"
        [width]="'100%'"
        [maxWidth]="'1400px'"
    >
    </app-data-grid>
  `
})
export class MyGridComponent {
  gridData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 }
  ];

  columns: GridColumn[] = [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: 'Name', width: 200 },
    { field: 'email', title: 'Email', width: 250 },
    { field: 'age', title: 'Age', width: 100 }
  ];
}
```

### 2. Basic Configuration

```typescript
gridConfig = {
  pageable: true,
  pageSize: 25,
  sortable: true,
  filterable: true,
  exportable: true,
  selectable: true
};
```

---

## ⚙️ Configuration

### 📏 Grid Width Configuration

#### Method 1: Component Inputs (Recommended)

```html
<!-- Full Width -->
<app-data-grid 
    [width]="'100%'" 
    [maxWidth]="'100%'">
</app-data-grid>

<!-- Fixed Width (1400px) -->
<app-data-grid 
    [width]="'100%'" 
    [maxWidth]="'1400px'">
</app-data-grid>

<!-- Narrow Grid (1200px) -->
<app-data-grid 
    [width]="'100%'" 
    [maxWidth]="'1200px'">
</app-data-grid>

<!-- Wide Grid (1800px) -->
<app-data-grid 
    [width]="'100%'" 
    [maxWidth]="'1800px'">
</app-data-grid>

<!-- Percentage (80% of container) -->
<app-data-grid 
    [width]="'80%'" 
    [maxWidth]="'100%'">
</app-data-grid>

<!-- Viewport Width (90vw) -->
<app-data-grid 
    [width]="'90vw'" 
    [maxWidth]="'100%'">
</app-data-grid>
```

#### Method 2: TypeScript Variables (Dynamic)

```typescript
export class MyComponent {
  gridWidth = '100%';
  gridMaxWidth = '1400px';
  
  changeGridSize(size: 'small' | 'medium' | 'large') {
    switch(size) {
      case 'small': this.gridMaxWidth = '1200px'; break;
      case 'medium': this.gridMaxWidth = '1400px'; break;
      case 'large': this.gridMaxWidth = '1800px'; break;
    }
  }
}
```

```html
<app-data-grid
    [width]="gridWidth"
    [maxWidth]="gridMaxWidth"
>
</app-data-grid>
```

---

### 🎨 Theme System

#### Auto Mode (Follows System Preference)
```html
<app-data-grid [theme]="'auto'">
</app-data-grid>
```

#### Light Theme
```html
<app-data-grid [theme]="'light'">
</app-data-grid>
```

#### Dark Theme
```html
<app-data-grid [theme]="'dark'">
</app-data-grid>
```

#### Dynamic Theme Switching
```typescript
export class MyComponent {
  currentTheme: 'light' | 'dark' | 'auto' = 'auto';
  
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
  }
}
```

```html
<button (click)="toggleTheme()">Toggle Theme</button>
<app-data-grid [theme]="currentTheme">
</app-data-grid>
```

---

### ✏️ CRUD Operations

#### Dual Edit Modes

**1. Inline Editing (Quick Edit)**
```typescript
startEdit(row: any) {
  this.editingRow = { ...row };
}

saveEdit(row: any) {
  const index = this.gridData.findIndex(item => item.id === row.id);
  if (index !== -1) {
    this.gridData[index] = { ...this.editingRow };
  }
  this.editingRow = null;
}

cancelEdit() {
  this.editingRow = null;
}
```

**2. Modal Editing (Detailed Edit)**
```typescript
openEditModal(row: any) {
  this.selectedRow = { ...row };
  this.showEditModal = true;
  this.dataGrid.openModal('edit');
}

saveEditModal() {
  const index = this.gridData.findIndex(item => item.id === this.selectedRow.id);
  if (index !== -1) {
    this.gridData[index] = { ...this.selectedRow };
  }
  this.closeModal();
}
```

#### Add New Record
```typescript
openAddModal() {
  this.newRow = { id: 0, name: '', email: '', age: 0 };
  this.showAddModal = true;
  this.dataGrid.openModal('add');
}

saveNewRow() {
  const newId = Math.max(...this.gridData.map(item => item.id)) + 1;
  this.gridData.push({ ...this.newRow, id: newId });
  this.closeModal();
}
```

#### Delete with Confirmation
```typescript
openDeleteModal(row: any) {
  this.selectedRow = row;
  this.showDeleteModal = true;
  this.dataGrid.openModal('delete');
}

confirmDelete() {
  const index = this.gridData.findIndex(item => item.id === this.selectedRow.id);
  if (index !== -1) {
    this.gridData.splice(index, 1);
  }
  this.closeModal();
}
```

---

### 🔧 Advanced Features

#### Custom Cell Templates
```html
<app-data-grid [data]="gridData" [columns]="columns">
  <!-- Custom avatar + name template -->
  <ng-template gridCellTemplate="name" let-row>
    <div style="display: flex; align-items: center; gap: 8px;">
      <img [src]="row.avatar" style="width: 32px; height: 32px; border-radius: 50%;">
      <span style="font-weight: 600;">{{ row.name }}</span>
    </div>
  </ng-template>
  
  <!-- Custom status badge template -->
  <ng-template gridCellTemplate="status" let-row>
    <span [class]="'badge badge-' + row.status">
      {{ row.status }}
    </span>
  </ng-template>
</app-data-grid>
```

#### Custom Footer Templates
```html
<ng-template gridFooterTemplate="amount" let-data="data">
  <div style="font-weight: 700; color: var(--primary-color);">
    Total: ${{ calculateTotal(data, 'amount') }}
  </div>
</ng-template>
```

#### Global Search
```typescript
gridConfig = {
  globalSearch: true,
  // ... other config
};
```

#### Advanced Filtering
```typescript
columns = [
  {
    field: 'age',
    title: 'Age',
    filterable: true,
    filterType: 'number', // 'text', 'number', 'date', 'boolean'
    filterOperators: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte']
  }
];
```

#### Grouping
```typescript
gridConfig = {
  groupable: true,
  // ... other config
};

// Group by country
groupBy(['country']);
```

#### Export Data
```typescript
// Export to Excel
exportToExcel();

// Export to CSV
exportToCSV();

// Export to PDF
exportToPDF();

// Export to JSON
exportToJSON();
```

---

## 📚 API Reference

### Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `any[]` | `[]` | Grid data source |
| `columns` | `GridColumn[]` | `[]` | Column definitions |
| `config` | `GridConfig` | `{}` | Grid configuration |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Theme mode |
| `width` | `string` | `'100%'` | Grid width |
| `maxWidth` | `string` | `'100%'` | Grid max-width |
| `showAddButton` | `boolean` | `false` | Show add button in toolbar |

### Outputs

| Event | Payload | Description |
|-------|---------|-------------|
| `dataStateChange` | `DataStateChangeEvent` | Fired when data state changes (sort, filter, page) |
| `onEdit` | `any` | Fired when edit button clicked |
| `onDelete` | `any` | Fired when delete button clicked |
| `onAdd` | `void` | Fired when add button clicked |
| `onSelectionChange` | `any[]` | Fired when row selection changes |

### GridColumn Interface

```typescript
interface GridColumn {
  field: string;              // Data field name
  title: string;              // Column header title
  width?: number;             // Column width (px)
  minWidth?: number;          // Minimum width
  sortable?: boolean;         // Enable sorting
  filterable?: boolean;       // Enable filtering
  filterType?: 'text' | 'number' | 'date' | 'boolean';
  groupable?: boolean;        // Enable grouping
  resizable?: boolean;        // Enable resizing
  reorderable?: boolean;      // Enable reordering
  hidden?: boolean;           // Hide column
  locked?: boolean;           // Lock column position
  format?: string;            // Display format
  template?: TemplateRef<any>; // Custom cell template
  footerTemplate?: TemplateRef<any>; // Custom footer template
}
```

### GridConfig Interface

```typescript
interface GridConfig {
  pageable?: boolean;         // Enable pagination
  pageSize?: number;          // Page size (default: 25)
  pageSizes?: number[];       // Available page sizes
  sortable?: boolean;         // Enable sorting
  filterable?: boolean;       // Enable filtering
  groupable?: boolean;        // Enable grouping
  exportable?: boolean;       // Enable export
  selectable?: boolean;       // Enable row selection
  multiSelect?: boolean;      // Enable multi-row selection
  showSummary?: boolean;      // Show summary row
  columnMenu?: boolean;       // Show column menu
  resizable?: boolean;        // Enable column resizing
  reorderable?: boolean;      // Enable column reordering
  serverSide?: boolean;       // Server-side operations
  globalSearch?: boolean;     // Enable global search
}
```

---

## 💡 Examples

### Basic Example
```typescript
import { Component } from '@angular/core';
import { DataGrid } from '@nlabs/grid';
import { GridColumn } from '@nlabs/grid/interfaces';

@Component({
  selector: 'app-basic-example',
  imports: [DataGrid],
  template: `
    <app-data-grid
        [data]="data"
        [columns]="columns"
        [config]="config"
    >
    </app-data-grid>
  `
})
export class BasicExampleComponent {
  data = [
    { id: 1, name: 'Product 1', price: 99.99, stock: 50 },
    { id: 2, name: 'Product 2', price: 149.99, stock: 30 }
  ];

  columns = [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: 'Product Name', width: 200 },
    { field: 'price', title: 'Price', width: 120, format: 'currency' },
    { field: 'stock', title: 'Stock', width: 100 }
  ];

  config = {
    pageable: true,
    pageSize: 10,
    sortable: true,
    filterable: true
  };
}
```

### Advanced Example with Custom Templates
```typescript
@Component({
  template: `
    <app-data-grid
        [data]="orders"
        [columns]="columns"
        [theme]="'auto'"
        [width]="'100%'"
        [maxWidth]="'1600px'"
        (onEdit)="editOrder($event)"
        (onDelete)="deleteOrder($event)"
    >
      <!-- Custom customer template -->
      <ng-template gridCellTemplate="customer" let-row>
        <div class="customer-cell">
          <div class="avatar">{{ row.customer.charAt(0) }}</div>
          <span>{{ row.customer }}</span>
        </div>
      </ng-template>
      
      <!-- Custom status template -->
      <ng-template gridCellTemplate="status" let-row>
        <span [class]="'badge badge-' + row.status.toLowerCase()">
          {{ row.status }}
        </span>
      </ng-template>
      
      <!-- Custom total footer -->
      <ng-template gridFooterTemplate="amount" let-data="data">
        <strong>Total: {{ calculateTotal(data, 'amount') | currency }}</strong>
      </ng-template>
    </app-data-grid>
  `
})
export class AdvancedExampleComponent {
  orders = [...];
  columns = [...];
}
```

---

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Latest 2 versions ✅ |
| Firefox | Latest 2 versions ✅ |
| Safari | Latest 2 versions ✅ |
| Edge | Latest 2 versions ✅ |
| Opera | Latest 2 versions ✅ |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/nlabsGlobalAngular/nlabs-grid.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Development Guidelines

- Follow Angular style guide
- Write unit tests for new features
- Update documentation
- Ensure all tests pass: `npm test`
- Run linter: `npm run lint`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

### **Cuma Köse**
**Teknik Lider | Technical Lead**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/turkmvc/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/turkmvc)

---

**⭐ If you find this project useful, please consider giving it a star!**

**🐛 Found a bug? [Open an issue](https://github.com/nlabsGlobalAngular/nlabs-grid/issues)**

**💡 Have a feature request? [Start a discussion](https://github.com/nlabsGlobalAngular/nlabs-grid/discussions)**

---

Made with ❤️ and Angular

</div>

## 🎯 Features

- ✅ **Customizable Width** - Set grid width via component inputs
- 🎨 **Theme Support** - Light, Dark, Auto modes
- ✏️ **Dual Edit Modes** - Inline editing + Modal editing
- 🗑️ **Delete Confirmation** - Modal popup with record details
- 📊 **Advanced Filtering** - Multiple filter operators
- 📈 **Sorting & Grouping** - Multi-column support
- 📤 **Export** - Excel, CSV, PDF formats
- 🔍 **Global Search** - Search across all columns
- 📱 **Responsive** - Mobile-friendly design

## 🚀 Quick Start

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

## 📏 Grid Width Configuration

### Method 1: Component Inputs (Recommended)

```html
<app-data-grid
    [data]="gridData"
    [columns]="columns"
    [width]="'100%'"
    [maxWidth]="'1400px'"
>
</app-data-grid>
```

### Method 2: TypeScript Variables (Dynamic)

**TypeScript:**
```typescript
export class MyComponent {
  gridWidth = '100%';
  gridMaxWidth = '1400px';
  
  changeGridSize(size: 'small' | 'medium' | 'large') {
    switch(size) {
      case 'small': this.gridMaxWidth = '1200px'; break;
      case 'medium': this.gridMaxWidth = '1400px'; break;
      case 'large': this.gridMaxWidth = '1800px'; break;
    }
  }
}
```

**HTML:**
```html
<app-data-grid
    [width]="gridWidth"
    [maxWidth]="gridMaxWidth"
>
</app-data-grid>
```

### Common Width Examples

```html
<!-- Full Width -->
<app-data-grid [width]="'100%'" [maxWidth]="'100%'">

<!-- Fixed Width (1400px) -->
<app-data-grid [width]="'100%'" [maxWidth]="'1400px'">

<!-- Narrow Grid (1200px) -->
<app-data-grid [width]="'100%'" [maxWidth]="'1200px'">

<!-- Wide Grid (1800px) -->
<app-data-grid [width]="'100%'" [maxWidth]="'1800px'">

<!-- Percentage (80% of container) -->
<app-data-grid [width]="'80%'" [maxWidth]="'100%'">

<!-- Viewport Width (90vw) -->
<app-data-grid [width]="'90vw'" [maxWidth]="'100%'">
```

## 🎨 Theme Configuration

```html
<!-- Auto (follows system preference) -->
<app-data-grid [theme]="'auto'">

<!-- Light Theme -->
<app-data-grid [theme]="'light'">

<!-- Dark Theme -->
<app-data-grid [theme]="'dark'">
```

## ✏️ CRUD Operations

### Dual Edit Modes

**1. Inline Editing (Quick Edit)**
- Click "Hızlı" button
- Edit directly in table row
- Save or Cancel

**2. Modal Editing (Detailed Edit)**
- Click "Detaylı" button
- Edit in modal form with all fields
- Save or Cancel

### Delete Confirmation

- Click "Sil" button
- Confirmation modal shows record details
- Choose "Evet, Sil" or "Hayır, İptal Et"

### Add New Record

- Click "Add" button in toolbar
- Fill form in modal
- Submit "Yeni Kayıt Ekle"

## 📋 Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## 🏗️ Building


To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
