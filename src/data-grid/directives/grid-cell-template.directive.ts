import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[gridCellTemplate]',
  standalone: true
})
export class GridCellTemplateDirective {
  @Input('gridCellTemplate') field!: string;

  constructor(public template: TemplateRef<any>) {}
}
