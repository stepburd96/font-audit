const fs = require("fs");
const { parse } = require("csv-parse");

function runDiff(data ,colA, colB) {
  //Columns will be 0 indexed
  //Filter through the arrs that createReadStream spits out by the column index
  const parentList = data.map(x => x[colA]);
  const childList = data.map(x => x[colB]);
  const missingFonts = childList.filter(x => !parentList.includes(x) && x);
  return missingFonts
}

function removeDuplicates(arr) {
  return [...new Set(arr)];
}

async function main(){
  let data = new Array()
  const readStream = fs.createReadStream("./data/SynchronyFonts.csv")
    .pipe( parse({ delimiter: ",", from_line: 2 }) );

  for await (const row of readStream) {
    data.push(row);
  }

  missingFontsArrs = new Array()
  missingFonts = new Array()

  for (let i = 1; i < data.length; i++){
    missingFontsArrs.push(runDiff(data, 0, i))
  }

  for (let i = 0; i < missingFontsArrs.length; i++){
    for (let j = 0; j < missingFontsArrs[i].length; j++) {
      missingFonts.push(missingFontsArrs[i][j])
    } 
  }

  missingFonts = missingFonts.sort()  
  missingFonts = removeDuplicates(missingFonts)

  try {
    fs.writeFileSync('./data/fontsToEnable.txt', missingFonts.toString());
    // file written successfully
  } catch (err) {
    console.error(err);
  }

}

main()