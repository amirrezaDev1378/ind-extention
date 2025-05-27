import axios from "axios";

const baseUrl = "https://raw.githubusercontent.com/amirrezaDev1378/idn-extention/refs/heads/master/idnList.json";

export const fetchIdnList = async () => {

    const idnListInStorage = await storage.getItem('local:idnList');
    if (idnListInStorage) {
        return idnListInStorage;
    }


    const response = await axios.get(baseUrl);
    const idnList = await response.data
    
    //  store in browser storage
    await storage.setItem('local:idnList', idnList);
    console.log(idnList);

    return idnList;
}
