import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataGrid } from "../data-grid/data-grid";
import { GridColumn } from '../data-grid/interfaces/grid-column';
import { GridConfig } from '../data-grid/interfaces/grid-config';
import { DataStateChangeEvent } from '../data-grid/interfaces/data-state-change-event';
import { GridCellTemplateDirective } from '../data-grid/directives/grid-cell-template.directive';
import { GridFooterTemplateDirective } from '../data-grid/directives/grid-footer-template.directive';

@Component({
  selector: 'app-grid-template',
  imports: [CommonModule, FormsModule, DataGrid, GridCellTemplateDirective, GridFooterTemplateDirective],
  templateUrl: './grid-template.html',
  styleUrl: './grid-template.css'
})
export class GridTemplate implements OnInit {
  @ViewChild(DataGrid) dataGrid!: DataGrid;
  
  // Grid genişlik ayarları (opsiyonel - HTML'de direkt de kullanabilirsiniz)
  gridWidth = '100%';
  gridMaxWidth = '1400px';
  
  // Tema ayarları
  selectedTheme: 'light' | 'dark' | 'auto' = 'auto';
  showThemeButton = true; // Tema değiştir butonunu göster/gizle
  
  ngOnInit() {
    console.log('GridTemplate ngOnInit - gridData:', this.gridData.length, 'columns:', this.columns.length);
  }
  
  // Tema değiştir
  changeTheme(theme: 'light' | 'dark' | 'auto') {
    this.selectedTheme = theme;
  }
  
  gridData = [
      {
        id: 1,
        customer: 'Vins et alcools',
        orderDate: '7/4/2018',
        freight: 32.38,
        shipCountry: 'France',
        shippingCompany: 'Federal Shipping',
      },
      {
        id: 2,
        customer: 'Toms Spezialitäten',
        orderDate: '7/5/2018',
        freight: 11.61,
        shipCountry: 'Germany',
        shippingCompany: 'Speedy Express',
      },
      {
        id: 3,
        customer: 'Hanari Carnes',
        orderDate: '7/8/2018',
        freight: 65.83,
        shipCountry: 'Brazil',
        shippingCompany: 'United Package',
      },
      {
        id: 4,
        customer: 'Victuailles en stock',
        orderDate: '7/8/2018',
        freight: 41.34,
        shipCountry: 'France',
        shippingCompany: 'Federal Shipping',
      },
      {
        id: 5,
        customer: 'Suprêmes délices',
        orderDate: '7/9/2018',
        freight: 51.3,
        shipCountry: 'Belgium',
        shippingCompany: 'Speedy Express',
      },
      {
        id: 6,
        customer: 'Chop-suey Chinese',
        orderDate: '7/10/2018',
        freight: 24.05,
        shipCountry: 'Switzerland',
        shippingCompany: 'United Package',
      },
      {
        id: 7,
        customer: 'Richter Supermarkt',
        orderDate: '7/11/2018',
        freight: 23.79,
        shipCountry: 'Switzerland',
        shippingCompany: 'Federal Shipping',
      },
      {
        id: 8,
        customer: 'Wellington Importadora',
        orderDate: '7/12/2018',
        freight: 148.33,
        shipCountry: 'Brazil',
        shippingCompany: 'Speedy Express',
      },
      {
        id: 9,
        customer: 'HILARION-Abastos',
        orderDate: '7/15/2018',
        freight: 13.97,
        shipCountry: 'Venezuela',
        shippingCompany: 'United Package',
      },
      {
        id: 10,
        customer: 'Ernst Handel',
        orderDate: '7/16/2018',
        freight: 4.41,
        shipCountry: 'Austria',
        shippingCompany: 'Federal Shipping',
      },      
      {
        id: 11,
        customer: 'Ernst Handel 2',
        orderDate: '7/16/2019',
        freight: 4.45,
        shipCountry: 'Austria 2',
        shippingCompany: 'Federal Shipping 2',
      },
    ];
  
    columns: GridColumn[] = [
      // ÖRNEK 1: INDEX KOLONU (Satır Numarası)
      {
        field: 'rowIndex', // Field name önemli değil çünkü showIndex=true
        header: '#',
        showIndex: true, // Satır numarasını göster (1, 2, 3, ...)
        sortable: false,
        filterable: false,
        width: '60px',
        editable: false,
      },
      // ÖRNEK 2: valueGetter ile veriyi değiştirmeden görünümünü özelleştirme
      {
        field: 'customer',
        header: 'Müşteri Adı', // Özel Türkçe başlık
        // ÖRNEK 3: headerContent ile header'a ikon ekleme
        headerContent: `
          <div style="display: flex; align-items: center; gap: 6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Müşteri Adı</span>
          </div>
        `,
        sortable: true,
        filterable: true,
        filterType: 'text',
        width: '220px',
        visible: true,
        // valueGetter: Veriyi manipüle et (data değişmez, sadece gösterim değişir)
        valueGetter: (row: any, index: number) => {
          // Orijinal customer değerini al
          return row.customer;
        },
        // cellTemplate: valueGetter'dan gelen değeri istediğin gibi göster
        cellTemplate: (value: string, row: any) => {
          const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
          const color = colors[value.length % colors.length];
          return `
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${color}" stroke="none">
                <circle cx="12" cy="12" r="10"></circle>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">
                  ${value.charAt(0)}
                </text>
              </svg>
              <span style="
                background: ${color}20;
                color: ${color};
                padding: 4px 12px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 13px;
                border: 1px solid ${color}40;
              ">${value}</span>
            </div>
          `;
        }
      },
      {
        field: 'orderDate',
        // ÖRNEK 4: Function ile dinamik header
        headerContent: (col) => `
          <div style="display: flex; align-items: center; gap: 6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Order Date</span>
          </div>
        `,
        sortable: true,
        filterable: true,
        filterType: 'date',
        type: 'date',
        width: '150px',
      },
      {
        field: 'freight',
        header: 'Nakliye Ücreti', // Özel Türkçe başlık
        sortable: true,
        filterable: true,
        filterType: 'number',
        type: 'number',
        width: '120px',
        aggregate: 'sum',
        format: (value) => `$${value?.toFixed(2)}`,
        // Özel cell template - yüksek değerleri kırmızı, düşük değerleri yeşil yap
        cellTemplate: (value: number, row: any) => {
          const color = value > 100 ? '#ef4444' : value > 50 ? '#f59e0b' : '#10b981';
          return `<span style="color: ${color}; font-weight: 600;">$${value.toFixed(2)}</span>`;
        },
        // Özel cell class - değere göre dinamik class
        cellClass: (row: any) => {
          const value = row.freight;
          if (value > 100) return 'high-value';
          if (value > 50) return 'medium-value';
          return 'low-value';
        },
        // Özel cell style - arka plan rengi
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
        // Özel footer değeri
        footerValue: (data: any[]) => {
          const total = data.reduce((sum, row) => sum + (row.freight || 0), 0);
          const avg = total / data.length;
          return `Total: $${total.toFixed(2)} | Avg: $${avg.toFixed(2)}`;
        }
      },
      // ÖRNEK 5: valueGetter ile ülke bayrakları ekleme (data değişmeden)
      {
        field: 'shipCountry',
        headerContent: `
          <div style="display: flex; align-items: center; gap: 6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M2 12h20"></path>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>Ship Country</span>
          </div>
        `,
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterValues: ['France', 'Germany', 'Brazil', 'Belgium', 'Switzerland'],
        width: '180px',
        // valueGetter: Ülke kodunu emoji flag'e çevir
        valueGetter: (row: any) => {
          const countryFlags: { [key: string]: string } = {
            'France': '🇫🇷',
            'Germany': '🇩🇪',
            'Brazil': '🇧🇷',
            'Belgium': '🇧🇪',
            'Switzerland': '🇨🇭',
            'USA': '🇺🇸',
            'UK': '🇬🇧',
            'Spain': '🇪🇸',
            'Italy': '🇮🇹',
          };
          return { flag: countryFlags[row.shipCountry] || '🏳️', name: row.shipCountry };
        },
        // cellTemplate: Flag + country name göster
        cellTemplate: (value: any, row: any) => {
          return `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 20px;">${value.flag}</span>
              <span style="font-weight: 500;">${value.name}</span>
            </div>
          `;
        }
      },
      // ÖRNEK 6: valueGetter ile şirket logoları/ikonları ekleme
      {
        field: 'shippingCompany',
        headerContent: `
          <div style="display: flex; align-items: center; gap: 6px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Shipping Company</span>
          </div>
        `,
        sortable: true,
        filterable: true,
        filterType: 'multiselect',
        width: '230px',
        // valueGetter: Şirket bilgilerini zenginleştir
        valueGetter: (row: any) => {
          const companyIcons: { [key: string]: { icon: string; color: string } } = {
            'Federal Shipping': { icon: '📦', color: '#4f46e5' },
            'Speedy Express': { icon: '⚡', color: '#059669' },
            'United Package': { icon: '🚚', color: '#dc2626' },
            'Global Express': { icon: '🌐', color: '#2563eb' },
            'Quick Delivery': { icon: '🚀', color: '#7c3aed' },
          };
          const info = companyIcons[row.shippingCompany] || { icon: '📮', color: '#6b7280' };
          return {
            name: row.shippingCompany,
            icon: info.icon,
            color: info.color
          };
        },
        // cellTemplate: Company icon + badge
        cellTemplate: (value: any, row: any) => {
          return `
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: ${value.color}15;
                border-radius: 8px;
                font-size: 16px;
              ">
                ${value.icon}
              </div>
              <span style="
                background: ${value.color}10;
                color: ${value.color};
                padding: 5px 12px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 12px;
                border: 1px solid ${value.color}30;
              ">${value.name}</span>
            </div>
          `;
        },
        // Footer'da benzersiz shipping company sayısını göster
        footerValue: (data: any[]) => {
          const uniqueCompanies = new Set(data.map(row => row.shippingCompany));
          return `${uniqueCompanies.size} Companies`;
        }
      }
      // Actions column otomatik eklenecek (ng-template varsa)
    ];
  
    gridConfig: GridConfig = {
      // Pagination
      pageable: true,
      pageSize: 25,
      pageSizes: [10, 25, 50, 100],
      serverSide: false,
      virtualScroll: false,
  
      // Features
      sortable: true,
      multiSort: true, // Enable multi-column sorting with Ctrl+Click
      filterable: true,
      advancedFiltering: true, // Enable advanced filter operators
      groupable: true,
      dragGrouping: true, // Enable drag & drop grouping
      exportable: true,
      selectable: true,
      multiSelect: true,
      showSummary: true,
  
      // Column Management
      columnMenu: true,
      resizable: true,
      reorderable: true,
      pinnable: true, // Enable column pinning
      autoFitColumns: false,
  
      // Row Operations
      editable: true, // Enable inline editing
      rowDetails: false, // Enable expandable row details
      rowDraggable: false,
  
      // Search & Filter
      globalSearch: true, // Enable global search
      inlineSearch: true, // Enable inline column search
      filterMode: 'menu',
  
      // Styling
      conditionalFormatting: true, // Enable cell coloring
      striped: true, // Alternate row colors
      bordered: true, // Show borders
      hover: true, // Highlight on hover
  
      // Footer Configuration
      showFooter: true, // Show custom footer
      footerClass: 'custom-footer-style', // Özel CSS class
      customAggregates: {
        // OrderDate için özel hesaplama - en yeni ve en eski tarihi göster
        orderDate: (data: any[]) => {
          if (data.length === 0) return 'No Data';
          const dates = data.map(row => new Date(row.orderDate)).sort((a, b) => a.getTime() - b.getTime());
          const oldest = dates[0].toLocaleDateString();
          const newest = dates[dates.length - 1].toLocaleDateString();
          return `${oldest} - ${newest}`;
        },
        // ShipCountry için özel hesaplama - benzersiz ülke sayısı
        shipCountry: (data: any[]) => {
          const uniqueCountries = new Set(data.map(row => row.shipCountry));
          return `${uniqueCountries.size} Countries`;
        }
      },
  
      // State Management
      persistState: false, // Save state to localStorage
      stateKey: 'my-advanced-grid',
  
      // Performance
      debounceTime: 300,
    };
    
    onDataStateChange(event: DataStateChangeEvent) {
      console.log('Data State Changed:', event);
      
      // SERVER-SIDE kullanımda buradan backend'e istek atabilirsiniz
      // this.orderService.getOrders(event).subscribe(result => {
      //   this.gridData = of(result);
      // });
    }
    onEditRow(row: any) {
      console.log('Edit:', row);
      // Edit modal aç veya route'a yönlendir
    }
    onSelectionChanged(selected: any[]) {
      console.log('Selected rows:', selected);
    }
    onDeleteRow(row: any) {
      console.log('Delete:', row);
      // Silme onayı al ve backend'e istek at
    }

    // Inline editing state
    editingRow: any = null;
    
    // Modal state
    showEditModal = false;
    showDeleteModal = false;
    showAddModal = false;
    selectedRow: any = null;
    newRow: any = {
      customer: '',
      orderDate: '',
      freight: 0,
      shipCountry: '',
      shippingCompany: ''
    };

    // Dinamik filter değerleri için
    // getShippingCompanies(): Observable<string[]> {
    //   return this.http.get<string[]>('/api/shipping-companies');
    // }

    // Modal Methods
    openEditModal(row: any) {
      this.selectedRow = { ...row };
      this.showEditModal = true;
      this.showDeleteModal = false;
      this.showAddModal = false;
      if (this.dataGrid) {
        this.dataGrid.openModal('edit');
      }
    }

    openDeleteModal(row: any) {
      this.selectedRow = row;
      this.showDeleteModal = true;
      this.showEditModal = false;
      this.showAddModal = false;
      if (this.dataGrid) {
        this.dataGrid.openModal('delete');
      }
    }

    openAddModal() {
      this.newRow = {
        customer: '',
        orderDate: '',
        freight: 0,
        shipCountry: '',
        shippingCompany: ''
      };
      this.showAddModal = true;
      this.showEditModal = false;
      this.showDeleteModal = false;
      if (this.dataGrid) {
        this.dataGrid.openModal('add');
      }
    }

    closeModal() {
      this.showEditModal = false;
      this.showDeleteModal = false;
      this.showAddModal = false;
      this.selectedRow = null;
      if (this.dataGrid) {
        this.dataGrid.closeModal();
      }
    }

    saveEditModal() {
      if (this.selectedRow) {
        const index = this.gridData.findIndex(item => item.id === this.selectedRow.id);
        if (index !== -1) {
          this.gridData[index] = { ...this.selectedRow };
          console.log('Row updated:', this.gridData[index]);
        }
        this.closeModal();
      }
    }

    confirmDelete() {
      if (this.selectedRow) {
        const index = this.gridData.findIndex(item => item.id === this.selectedRow.id);
        if (index !== -1) {
          this.gridData.splice(index, 1);
          console.log('Row deleted:', this.selectedRow);
        }
        this.closeModal();
      }
    }

    saveNewRow() {
      if (this.newRow.customer && this.newRow.orderDate) {
        const newId = Math.max(...this.gridData.map(item => item.id)) + 1;
        const newRecord = {
          id: newId,
          ...this.newRow
        };
        this.gridData.push(newRecord);
        console.log('New row added:', newRecord);
        this.closeModal();
      }
    }

    // Inline Editing Methods (for actions template)
    startEdit(row: any) {
      // Create a deep copy of the row for editing
      this.editingRow = { ...row };
      console.log('Start editing:', row);
    }

    saveEdit(row: any) {
      console.log('Save edit:', this.editingRow);
      // Update the original row with edited values
      const index = this.gridData.findIndex(item => item.id === row.id);
      if (index !== -1) {
        // Copy edited values back to the original data
        this.gridData[index] = { ...this.gridData[index], ...this.editingRow };
      }
      this.editingRow = null;
    }

    cancelEdit() {
      console.log('Cancel edit');
      // Discard changes and exit editing mode
      this.editingRow = null;
    }

    deleteRow(row: any) {
      // This method is replaced by openDeleteModal/confirmDelete
      // Kept for backward compatibility
      this.openDeleteModal(row);
    }

    // Template helper methods
    calculateTotal(data: any[], field: string): string {
      const total = data.reduce((sum, row) => sum + (row[field] || 0), 0);
      return total.toFixed(2);
    }

    calculateAverage(data: any[], field: string): string {
      if (data.length === 0) return '0.00';
      const total = data.reduce((sum, row) => sum + (row[field] || 0), 0);
      return (total / data.length).toFixed(2);
    }
}
