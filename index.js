const puppeteer = require('puppeteer');
const fs = require('fs');
const _ = require('lodash');

const Airtable = require('airtable');
const base = new Airtable({apiKey: 'keyv7OeSSAzrj1WQ3'}).base('');
const arr = [
    'linkedin.com',
    'instagram.com',
    'twitter.com',
    'facebook.com'
];

const competitorStrings = [
    'getsitecontrol',
    'useproof',
    'provesrc',
    'trstplse',
    'opmnstr',
    'usefomo',
    'convertflow',
    'clickfunnels',
    'leadpages',
    'optkit',
    'raaft',
    'churnbuster',
    'getdrip',
    'reviews',
    'sumo',
    'subscribers',
    'tapfilliate',
    'survicate',
    'crazyegg',
    'hellobar',
    'intercom',
    'hotjar',
    'notifia',
    'beeketing',
    'crowdy',
    'shopify',
    'socialprove',
    'helpscout',
    'magnific',
    'wp-content',
    'addthis',
    'drift',
    'instapage',
    'clicktale',
    'baremetrics',
    'adwords',
    'girafi',
    'qualaroo',
    'rightbar',
    'Appocalypsis',
    'mixpanel',
    'sleeknote',
    'maxtraffic',
    'fullstory',
    'autopilot',
    'leadlizard',
    'fera',
    'recurly',
    'stripe',
    'bouncex',
    'churnbuster',
    'convertbox',
    'viralloops',
    'cloudflare',
    'privy',
    'formspree',
    'albacross',
    'wisepops',
    'powr',
    'taggstar',
    'optimonk',
    'optimizely',
    'growsumo',
    'growsurf',
    'exitbee',
    'appcues',
    'refferalcandy',
    'poptin',
    'birdseed',
    'fera',
    'fomify',
    'sitekit',
    'socialprova',
    'boostflow',
    'getsitekit',
    'freshmarketer',
    'hoversignal',
    'gethellobox',
    'conversionsbox',
    'inboundrocket',
    'morevago'




];


let emails = [];
let linkedin = [];
let instagram = [];
let twitter = [];
let facebook = [];
let phoneNumbers = [];



let websites = JSON.parse(fs.readFileSync('websites.json', 'UTF-8'));
const resultsFile = JSON.parse(fs.readFileSync('result.json', 'UTF-8'));
let globalBrowser;
let globalPage;
const openBrowser = async (websiteData) => {
    const website = websiteData.website;

    emails = [];
    linkedin = [];
    instagram = [];
    twitter = [];
    facebook = [];
    phoneNumbers = [];

    try {
        if (!globalBrowser) {
            globalBrowser = await puppeteer.launch({args: ['--no-sandbox']});
        }
        const page = await globalBrowser.newPage();
        globalPage = page;
        //setViewport
        await page.setViewport({width: 1024, height: 800});

        //Start Trace
        // await page.tracing.start({path: 'trace.json'});

        //Navigate
        await page.goto(website, {waitUntil: 'load', timeout: 60000});

        //Stop Trace
        // await page.tracing.stop();
        // await page.evaluate()
        /** get scripts **/
        const data = await page.evaluate(
            () => Array.prototype.slice
                .apply(document.querySelectorAll('script'))
                .filter(s => s.src)
                .map(s => s.src)
        );
        /** get scripts **/


        const hrefs = await page.evaluate(() => {
            const anchors = document.querySelectorAll('a');
            return [].map.call(anchors, a => a.href);
        });


        const mobileRegexps = [
            new RegExp('^\\D?(\\d{3})\\D?\\D?(\\d{3})\\D?(\\d{4})$\n'),
            new RegExp('^([0-9]( |-)?)?(\\(?[0-9]{3}\\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[a-zA-Z0-9]{7})$\n'),
            new RegExp('((\\(\\d{3}\\)?)|(\\d{3}))([\\s-./]?)(\\d{3})([\\s-./]?)(\\d{4})'),
            new RegExp('^(\\(?\\+?[0-9]\\)?)?[0-9_\\- \\(\\)]$'),
            new RegExp('(^\\+[0-9]{2}|^\\+[0-9]{2}\\(0\\)|^\\(\\+[0-9]{2}\\)\\(0\\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\\-\\s]{10}$)'),
            new RegExp('^[\\\\(]{0,1}([0-9]){3}[\\\\)]{0,1}[ ]?([^0-1]){1}([0-9]){2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1,5}){0,1}$'),
            new RegExp('(\\s\\(?0\\d{4}\\)?\\s\\d{6}\\s)|(\\s\\(?0\\d{3}\\)?\\s\\d{3}\\s\\d{4}\\s*)'),
            new RegExp('^\\(0[1-9]{1}\\)[0-9]{8}$'),
            new RegExp('^1?[-\\. ]?(\\(\\d{3}\\)?[-\\. ]?|\\d{3}?[-\\. ]?)?\\d{3}?[-\\. ]?\\d{4}$'),
            new RegExp('(?:(?:(?:\\+)?1[\\-\\s\\.])?(?:\\s?\\()?(?:[2-9][0-8][0-9])(?:\\))?(?:[\\s|\\-|\\.])?)(?:(?:(?:[2-9][0-9|A-Z][0-9|A-Z])(?:[\\s|\\-|\\.])?)(?:[0-9|A-Z][0-9|A-Z][0-9|A-Z][0-9|A-Z]))'),
        ];


        hrefs.map((href) => {
            if (href.includes('mailto') && emails.indexOf(href) < 0 || href.includes('@') && emails.indexOf(href) < 0) {
                emails.push(href.split(':')[1]);
            }
            if (href.includes('linkedin.com/company') && linkedin.indexOf(href) < 0 || href.includes('linkedin.com/in') && linkedin.indexOf(href) < 0) {
                linkedin.push(href);
            }
            if (href.includes('instagram.com') && instagram.indexOf(href) < 0) {
                instagram.push(href);
            }
            if (href.includes('twitter.com') && twitter.indexOf(href) < 0) {
                twitter.push(href);
            }

            if (href.includes('facebook.com') && facebook.indexOf(href) < 0) {
                facebook.push(href);
            }

            for (let i = 0; i < mobileRegexps.length; i++) {
                if (mobileRegexps[i].test(href)) {
                    phoneNumbers.push(href);
                    break;
                }
            }

        });


        const scriptPromises = data.map(async (websiteScript, scriptIndex) => {
            return new Promise(async resolve => {
                const promises = competitorStrings.map(async (competitor, index) => {
                    return new Promise(async resolve => {
                        resolve(websiteScript.includes(competitor) ?
                            {
                                found: true,
                                data: {
                                    id: `${website + '-' + competitor}`,
                                    website,
                                    competitor,
                                    websiteScript,
                                    airTableId: websiteData.id,
                                    email : emails[0],
                                    linkedin:linkedin[0],
                                    instagram:instagram[0],
                                    twitter:twitter[0],
                                    facebook:facebook[0],
                                    phoneNumbers:phoneNumbers[0]
                                }
                            } :
                            {found: false, data: {website, competitor, airTableId: websiteData.id}}
                        )
                    });
                });
                Promise.all(promises).then(async results => {
                    resolve(results);
                });

            })
        });

        Promise.all(scriptPromises).then(async results => {
            const elements = _.flatten(results);
            const foundElements = _.chain(elements)
                .filter('found')
                .uniqBy('data.id')
                .value();


            // console.log(foundElements, 'elements');
            if (foundElements.length) {
                console.log(foundElements, 'elements');

                for (let i = 0; i < foundElements.length; i++) {
                    let element = foundElements[i];
                    const updateOjbect =
                        {...element.data,
                            status: 'up',
                            email : emails[0],
                            linkedin:linkedin[0],
                            instagram:instagram[0],
                            twitter:twitter[0],
                            facebook:facebook[0],
                            phoneNumbers:phoneNumbers[0]
                        };

                    await updateData(updateOjbect);
                    resultsFile.push(updateOjbect)
                }
            } else {
                const object = {website,
                    competitor: 'no one',
                    airTableId: websiteData.id,
                    email : emails[0],
                    linkedin:linkedin[0],
                    instagram:instagram[0],
                    twitter:twitter[0],
                    facebook:facebook[0],
                    phoneNumbers:phoneNumbers[0],
                    status: 'up'};
                await updateData(object);
                resultsFile.push(object)
            }

            fs.writeFileSync('result.json', JSON.stringify(resultsFile));
            websites.shift();
            fs.writeFileSync('websites.json', JSON.stringify(websites));
            page.close();


            if (websites.length) {
                openBrowser(websites[0]);
            } else {
                console.log("finished every");
                globalBrowser.close();
                process.exit(0);
            }
        })


    } catch (e) {
        console.log(e, 'dd');
        const object = {website,
            error: e.message,
            status: 'down',
            airTableId: websiteData.id,
            email : emails[0],
            linkedin:linkedin[0],
            instagram:instagram[0],
            twitter:twitter[0],
            facebook:facebook[0],
            phoneNumbers:phoneNumbers[0],
            competitor: 'no one'
        };
        resultsFile.push(object);
        await updateData(object);
        globalPage.close();

        fs.writeFileSync('result.json', JSON.stringify(resultsFile));
        websites.shift();
        fs.writeFileSync('websites.json', JSON.stringify(websites));
        if (websites.length) {
            openBrowser(websites[0]);
        } else {
            console.log("finished every");
            globalBrowser.close();

            process.exit(0);
        }
    }
};
openBrowser(websites[0]);


const updateData = async (data) => {
    return new Promise(resolve => {
        base('Database 🤑').find(data.airTableId, function (err, record) {
            if (err) {
                console.error(err);
                return;
            }
            const technologies = record.fields['Technologies Installed'] || [];
            const newTechnologies = [].concat(technologies, [data.competitor]);

            base('Database 🤑').update([
                {
                    "id": data.airTableId,
                    "fields": {
                        "Website": data.website,
                        //If 404 Received or Website Load Error can add in Website Status
                        "Website Status": data.status,
                        "Phone Number": data.phoneNumbers,
                        "Facebook": data.facebook,
                        "Twitter": data.twitter,
                        "LinkedIn": data.linkedin,
                        "Instagram": data.instagram,
                        "Website Scrape Email": data.email,
                        // Technologies Installed can be list of all technologies we find
                        "Technologies Installed": newTechnologies,
                        // Can add these in future

                    }
                }
            ], function (err, records) {
                if (err) {
                    console.error(err);
                    return;
                }
                resolve();
            });
        });
    });

};
