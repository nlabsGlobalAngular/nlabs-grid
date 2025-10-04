import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[gridFooterTemplate]',
  standalone: true
})
export class GridFooterTemplateDirective {
  @Input('gridFooterTemplate') field!: string;

  constructor(public template: TemplateRef<any>) {}
}
