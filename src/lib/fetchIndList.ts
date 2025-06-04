import axios from "axios";

const baseUrl =
  "https://raw.githubusercontent.com/amirrezaDev1378/ind-extention/refs/heads/master/indList.json";

export const fetchIndList = async () => {
  const indListInStorage = await storage.getItem("local:indList");
  const lastIndListFetch = await storage.getItem("local:lastIndListFetch");

  if (
    indListInStorage &&
    lastIndListFetch &&
    +lastIndListFetch > Date.now() - 24 * 60 * 60 * 1000
  ) {
    return indListInStorage;
  }
  const response = await axios.get(baseUrl);
  const indList = response.data;

  //  store in browser storage
  await storage.setItem("local:indList", indList);
  await storage.setItem("local:lastIndListFetch", Date.now());
  return indList;
};
