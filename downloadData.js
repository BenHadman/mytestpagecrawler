
const Airtable = require('airtable');
const fs = require('fs');


let websites = JSON.parse(fs.readFileSync('websites.json', 'UTF-8'));

const fetchData = () => {

    const base = new Airtable({apiKey: 'keyv7OeSSAzrj1WQ3'}).base('');

    base('Database 🤑').select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 30000,
        view: "Scrape Queue"
    }).eachPage(function page(records, fetchNextPage) {

        records.forEach(function (record) {
            websites.push({id: record.id, website: record.fields.Website});
            fs.writeFileSync('websites.json', JSON.stringify(websites));
        });

        fetchNextPage();

    });
};

fetchData();



