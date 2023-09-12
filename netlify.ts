import { Account } from "./database.types";

export const triggerBuild = async (account: Account) => {
    const buildWebhook = account.buildWebhook

    if (!buildWebhook) {
        console.log(`No build webhook for ${account.instagramHandle}`)
        return
    }

    console.log(`Triggering build for ${account.instagramHandle}...`)
    
    await fetch(buildWebhook, {
        method: "POST"
    })
}