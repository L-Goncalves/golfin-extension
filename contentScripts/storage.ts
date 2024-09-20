import { Storage } from "@plasmohq/storage";
export async function getCompaniesBlacklisted(){
    const storage = new Storage();
    const storedCompanies: any = (await storage.get("companies")) || []; // Fallback to an empty array

    return storedCompanies;
}