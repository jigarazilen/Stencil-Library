export interface SearchItem {
    searchField: string;
    searchOperator: string;
    searchValue: string;
  }

export interface SearchObject {
    filterElements: SearchItem[];
  }

export interface FilterDetail {
    filterType?: string;
    type?: string;
    filter?: string;
    filterTo?: string;
    dateFrom?: string;
    dateTo?: string;
  }

export interface HotListObject {
    hotListId: string;
  }


  // Define and export the type in the same file where your component is defined.
export type RenderConfig = {
  field: string;
  rendererName: string;
  otherField: string;
  callbackId: string;
  cellRendererParams?: CellRendererParams;
};


type CellRendererParams = {
  formatMode?: 'exact' | 'relative';  // Only 'exact' or 'relative' are allowed
  locale?: 'US' | 'UK';              // Only 'US' or 'UK' are allowed
};
