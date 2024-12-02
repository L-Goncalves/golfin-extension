export const isDev = process.env.NODE_ENV == "development"


export async function sleep(ms) {
    console.log('Sleeping for: ', ms, ' ms')
    return new Promise(resolve => setTimeout(resolve, ms));
}