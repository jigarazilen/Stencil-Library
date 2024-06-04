export const SharedContext = {
  myClickCallback: (otherCellValue, callbackId) => { 
    console.log('In callback',otherCellValue, callbackId)
   },
  viewActionCallback: (otherCellValue, callbackId) => { 
    console.log('In callback',otherCellValue, callbackId)
   },
  thirdActionCallback: (otherCellValue, callbackId) => { 
    console.log('In callback',otherCellValue, callbackId)
   },
  hotListAddHandler: null, // New handler specifically for HotListAddRenderer
  
};

  