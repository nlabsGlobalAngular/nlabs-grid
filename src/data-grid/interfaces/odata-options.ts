export interface ODataOptions {
  entitySet?: string;
  version?: 'v3' | 'v4';
  customParams?: { [key: string]: any };
}