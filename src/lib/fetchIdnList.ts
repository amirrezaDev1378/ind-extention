import * as cheerio from 'cheerio';
const baseUrl = "https://ind.nl/en/public-register-recognised-sponsors/public-register-regular-labour-and-highly-skilled-migrants";

export const fetchIdnList = async () => {

    const idnListInStorage = await storage.getItem('local:idnList');
    if (idnListInStorage) {
        return idnListInStorage;
    }


    const response = await fetch(baseUrl);
    const html = await response.text();
    const $ = cheerio.load(html);
    const idnList = $('.responsive-table > div > table > tbody > tr');
    const idnListArray:{idn: string, name: string}[] = [];
    idnList.each((index, element) => {
        const idn = $(element).find('th').text().trim();
        const name = $(element).find('td').text().trim();
        idnListArray.push({idn, name});
    });
    //  store in browser storage
    await storage.setItem('local:idnList', idnListArray);
    console.log(idnListArray);

    return idnListArray;
}
