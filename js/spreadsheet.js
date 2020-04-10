const { GoogleSpreadsheet } = require('google-spreadsheet');

// spreadsheet key is the long id in the sheets URL
const doc = new GoogleSpreadsheet('1ne3uU4Mqo6djga7bUM8IbFe4RVI2Dh_AEsaTTBsOt4M');

async function accessSpreadsheet(){
    await doc.useServiceAccountAuth(require('../my-goal-squad-02042020-71f97fd87b6c.json'));
    
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
    console.log(sheet.title);
    console.log(sheet.rowCount);

}

accessSpreadsheet();
 


 