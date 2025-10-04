export interface FilterDescriptor {
  field: string;
  operator: FilterOperator;
  value: any;
  value2?: any; // For 'between' operator
  logic?: 'and' | 'or';
  ignoreCase?: boolean;
}

export type FilterOperator = 
  | 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte'
  | 'contains' | 'notcontains' | 'startswith' | 'endswith'
  | 'isnull' | 'isnotnull' | 'isempty' | 'isnotempty'
  | 'in' | 'notin' | 'between';

export interface CompositeFilterDescriptor {
  logic: 'and' | 'or';
  filters: (FilterDescriptor | CompositeFilterDescriptor)[];
}