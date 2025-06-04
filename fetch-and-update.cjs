const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const indListUrl =
  "https://ind.nl/en/public-register-recognised-sponsors/public-register-regular-labour-and-highly-skilled-migrants";
const fetchAndUpdateData = async () => {
  const response = await axios.get(indListUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    },
  });
  const $ = cheerio.load(response.data);
  const rows = $("div.responsive-table-inner > table > tbody > tr");
  const data = [];
  rows.each((index, element) => {
    const name = $(element).find("th");
    const id = $(element).find("td");
    const rowData = {
      name: name
        .text()
        .trim()
        ?.replace(/ B\.V\..*/gi, ""),
      id: id.text().trim(),
    };
    data.push(rowData);
  });
  fs.writeFileSync("./indList.json", JSON.stringify(data, null, 2));
};

fetchAndUpdateData();
