const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvFile = [];
const dateList = [];
const nameList = [];
const headerObj = [];
const bodyObj = [];

fs.createReadStream('acme_worksheet.csv')
    .pipe(csv())
    .on('data',(data) => csvFile.push(data))
    .on('end', () => {
        

        dateList.push(csvFile[0]['Date']);
        nameList.push(csvFile[0]['Employee Name']);
        headerObj.push({id: "name", title: "NAME/DATE"});
        headerObj.push({id: "date1" , title: csvFile[0]['Date']});
        bodyObj.push({name:csvFile[0]['Employee Name']})
        let indexofDate = 2;
        for(let i = 1; i < csvFile.length; i++) {

            for(let name of nameList){
                if(!nameList.includes(csvFile[i]['Employee Name'])){
                    nameList.push(csvFile[i]['Employee Name']);
                    bodyObj.push({name: csvFile[i]['Employee Name']})
                }
            }

           for(let date of dateList){   
               if(!dateList.includes(csvFile[i]['Date'])){
                   dateList.push(csvFile[i]['Date']);
                   headerObj.push({id: "date" + indexofDate, title: csvFile[i]['Date']});
                   indexofDate++;   
               }
           }
           
        }
        
        for(let i= 0; i < bodyObj.length; i++){
            let index = 1;
            for(let j = 0; j < csvFile.length; j++){
                if(csvFile[j]['Employee Name'] == bodyObj[i].name){
                    bodyObj[i]['date' + index] = csvFile[j]["Work Hours"];
                    index++;
                }
            }
        }

        console.log(headerObj);
        console.log(bodyObj);


        const csvWriter = createCsvWriter({
            path: 'file.csv',
            header: headerObj
        });
        
       /* const records = [
            {name: 'Bob',date1: ""},
            {name: 'Mary', lang: 'English'}
        ]; */

        csvWriter.writeRecords(bodyObj)       
            .then(() => {
                console.log('...Done');
            }); 
        
            
  });





/*const csvWriter = createCsvWriter({
    path: 'file.csv',
    header: [
        {id: 'name_date', title: 'NAME/DATE'},
        {id: 'lang', title: 'LANGUAGE'}
    ]
});
 
const records = [
    {name: 'Bob',  lang: 'French, English'},
    {name: 'Mary', lang: 'English'}
];
 
csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    });  */
