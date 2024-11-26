export interface Menu {
  id: number;
  to: string;
  icon: string;
  label: string;
}

export interface Column<T> {
  name: string;
  label: string;
  field: string | ((row: T) => unknown);
  required?: boolean;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  sort?: (a: any, b: any, rowA: T, rowB: T) => number;
  format?: (val: any) => string;
  style?: string;
  classes?: string;
  headerStyle?: string;
  headerClasses?: string;
}
