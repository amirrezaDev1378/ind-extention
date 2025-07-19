const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const indListUrl =
  "https://ind.nl/en/public-register-recognised-sponsors/public-register-regular-labour-and-highly-skilled-migrants";
const ukListUrl =
  "https://assets.publishing.service.gov.uk/media/6878ecf42bad77c3dae4dd89/2025-07-17_-_Worker_and_Temporary_Worker.csv";
const fetchAndUpdateData = async () => {
  console.log("loading netherlands data");
  const netherlandsResponse = await axios.get(indListUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    },
  });

  const $ = cheerio.load(netherlandsResponse.data);
  const rows = $("div.responsive-table-inner > table > tbody > tr");
  const data = [];
  rows.each((index, element) => {
    const name = $(element).find("th:nth-child(1)");
    const id = $(element).find("td:nth-child(2)");

    const rowData = {
      name: name
        .text()
        .trim()
        ?.replaceAll(/ B\.V\..*/gi, "")
        ?.replaceAll(/ N\.V\..*/gi, ""),
      id: id.text().trim(),
    };
    data.push(rowData);
  });
  console.log("Netherlands data loaded");
  console.log("Loading UK DATA");
  const UKResponse = await axios.get(ukListUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    },
  });

  const UKData = UKResponse.data
    .split("\n")
    .slice(1)
    .map((line) => line.split(","))
    .map(([name, id], i) => ({
      name: name
        .replaceAll('\"', "")
        .replaceAll(/\.\?£@`/gi, "")
        .replaceAll(/[\[\(].*[\]\)](?=\s+\w)/gi, "")
        .replaceAll(/LTD/gi, ""),
      id: `${i} -- UK`,
    }));
  UKData.forEach((item) => data.push(item));
  console.log("UK DATA Loaded");

  fs.writeFileSync("./indList.json", JSON.stringify(data, null, 2));
};

fetchAndUpdateData();
