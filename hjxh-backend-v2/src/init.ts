import dayjs from "dayjs";
import {createPdd, Pdd} from "./pdd";
import {readRequestDict, RequestType} from "./config/readRequestDict";
import {accounts} from "./config/const";


export const fetchOneDay = async (pdd: Pdd, date: string) => {

    // const fetchUserInfo = async () => {
    //   await pdd.fetch(reqDict["userInfo"])
    // }

    const fetchOrdersByDate = async () => {
        await pdd.fetchOrdersByDate(date)
    }

    const fetchAdFangxinByDate = async () => {
        const req = readRequestDict(RequestType.adFangxin);
        req.params["mallId"] = pdd.mallId;
        req.targetDate = req.params["startDate"] = req.params["endDate"] = date;
        await pdd.fetch(req);
    }

    const fetchAdSearchByDate = async () => {
        const req = readRequestDict(RequestType.adSearch);
        req.params["mallId"] = pdd.mallId;
        req.targetDate = req.params["beginDate"] = req.params["endDate"] = date;
        await pdd.fetch(req);
    }

    const fetchAdSceneByDate = async () => {
        const req = readRequestDict(RequestType.adScene);
        req.params["mallId"] = pdd.mallId;
        req.targetDate = req.params["beginDate"] = req.params["endDate"] = date;
        await pdd.fetch(req);
    }

    const tasks = [
        await fetchOrdersByDate(),
        await fetchAdFangxinByDate(),
        await fetchAdSearchByDate(),
        await fetchAdSceneByDate(),
    ];
    await Promise.all(tasks);
    console.log(`>>> user: ${pdd.username} finished date ${date}`);
};

export const batchFetchOneDay = async (date: string) => {
    const tasks = accounts.map(async (username) => {
        const pdd = await createPdd(username);
        await fetchOneDay(pdd, date);
    });
    await Promise.all(tasks);
    console.log(">>> finished all");
};

const batchFetchMultiDays = async (startDate: string, backDays: number) => {
    const d = dayjs(startDate);
    const ds = [...Array(backDays).keys()].map((i) => d.subtract(i, "days").format("YYYY-MM-DD"));
    for (let date of ds) {
        console.log(`\n=== date: ${date} ===\n`);
        await batchFetchOneDay(date);
    }
    console.log(`>>> finished initialization of ${backDays} days from ${startDate}`);
};

if (require.main === module) {
    const date = "2021-07-20"
    batchFetchOneDay(date);
    // batchFetchMultiDays(date, 30);
}
