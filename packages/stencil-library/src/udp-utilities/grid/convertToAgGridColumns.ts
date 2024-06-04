const toTitleCase = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const convertToAgGridColumns = (data: any[]): any[] => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  const keys = Object.keys(data[0]);

  const columnDefs = keys.map((key, index) => {
    console.log('key', key)
    let columnDef: any = {
      headerName: toTitleCase(key),
      field: key,
      minWidth: 90,
      autoHeight: true,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        suppressAndOrCondition: true,
        filterOptions: [
            "equals",
            "contains",
            "notEqual",
            "greaterThan",
            "lessThan",
            "greaterThanOrEqual",
            "lessThanOrEqual"
        ]
      },
      enableRowGroup: true,
      checkboxSelection: index === 1,  // @todo: this is a hack to get the first column to be a checkbox
    };

    // Remove adding chckbox to the first column. This is now added as a single column in the grid, pinned to the left that the user cannot hide. 
    // if (index === 1) {
    //   columnDef.headerCheckboxSelection = true;
    //   columnDef.cellRendererParams = { checkbox: true };
    // }

    return columnDef;
  });

  return columnDefs;
};



//cellStyle: { 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' },
//resizable: true,