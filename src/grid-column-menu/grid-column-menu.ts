import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GridColumn } from '../data-grid/interfaces/grid-column';

@Component({
  selector: 'app-grid-column-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grid-column-menu.html',
  styleUrl: './grid-column-menu.css'
})
export class AppColumnMenu {
  @Input() columns: GridColumn[] = [];
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() columnToggled = new EventEmitter<GridColumn>();
  @Output() showAllColumns = new EventEmitter<void>();
  @Output() hideAllColumns = new EventEmitter<void>();

  searchTerm = '';

  get filteredColumns(): GridColumn[] {
    if (!this.searchTerm) return this.columns;
    
    const search = this.searchTerm.toLowerCase();
    return this.columns.filter(col => 
      col.header?.toLowerCase().includes(search) ?? false
    );
  }

  toggleColumn(column: GridColumn) {
    if (!column.locked) {
      this.columnToggled.emit(column);
    }
  }

  showAll() {
    this.showAllColumns.emit();
  }

  hideAll() {
    this.hideAllColumns.emit();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
