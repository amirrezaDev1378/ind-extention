const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const indListUrl =
  "https://ind.nl/en/public-register-recognised-sponsors/public-register-regular-labour-and-highly-skilled-migrants";
const ukListUrl =
  "https://assets.publishing.service.gov.uk/media/6878ecf42bad77c3dae4dd89/2025-07-17_-_Worker_and_Temporary_Worker.csv";
const canadaListUrl =
  "https://dataset.lmia.work/all/all.csv?_stream=on&_sort_desc=phase&_size=max";

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

  console.log("Canada Data Loading");
  const CanadaResponse = await axios.get(canadaListUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    },
  });
  const CanadaData = CanadaResponse.data
    .split("\n")
    .slice(1)
    .map((line) => line.split(","))
    .map(([id, province, employer = ""], i) => ({
      name: employer
        .replaceAll('\"', "")
        .replaceAll(/\.\?£@`/gi, "")
        .replaceAll(/[\[\(].*[\]\)](?=\s+\w)/gi, "")
        .replaceAll(/LTD|inc.|limited|inc/gi, ""),
      id: `${i} -- Canada`,
    }));
  CanadaData.forEach((item) => data.push(item));
  console.log("Canada DATA Loaded");

  console.log("Sorting and removing duplicates by name");
  // sort and remove duplicates by name
  const nameSet = new Set();
  const sortedData = data
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((item) => {
      if (nameSet.has(item.name)) return false;
      nameSet.add(item.name);
      return true;
    });
  console.log(`Writing ${sortedData.length} records to indList.json`);
  fs.writeFileSync("./indList.json", JSON.stringify(sortedData, null, 2));
};

fetchAndUpdateData();
