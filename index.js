const fs = require("fs-extra");
const path = require("path");

var dates = [
    {
      "MeasureDate": "2019-02-01T00:01:01.001Z",
    },
    { "MeasureDate": "2016-04-12T15:13:11.733Z",
    },
    {
      "MeasureDate": "2017-02-01T00:01:01.001Z",
    }
]



const dir = process.cwd();
const files = fs.readdirSync(dir);
let markdownFileName;
let latestDate = new Date(-1);

for (let i = 0, length = files.length; i < length; i++) {
    if (path.extname(files[i]) === '.md') {
        modifiedDateOfFile = fs.statSync(files[i]).mtime

        if(latestDate < modifiedDateOfFile){
            latestDate = modifiedDateOfFile
            markdownFileName = files[i];
        }
    }
}

console.log(markdownFileName)