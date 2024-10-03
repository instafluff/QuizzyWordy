const fs = require( "fs/promises" );
const ComfySheets = require( "comfysheets" );

// https://docs.google.com/spreadsheets/d/e/2PACX-1vTSi1dP6W-DyKMOfDZk-qoeAVoNQWy-kOTDKpI27kNYdOqbHvf_IRZ7LrusbjFSaCO31t7KqczxJzOj/pubhtml

async function getTheCzechWordsThings() {
    try {
        let wordData = await ComfySheets.Read( "1rGWoJd4utybt1wNPAWVrYmjnNKgSkQ_8nTd-54QtfGM", 'Form Responses 1', {
            "Czech Word": "word",
            "English Meaning": "translation",
        } );
        console.log( wordData );
        // Save the Word Data
        await fs.writeFile( "web/data/cs-en.json", JSON.stringify( wordData, null, 2 ) );
    }
    catch( err ) {
        console.log( err );
    }
}

getTheCzechWordsThings();