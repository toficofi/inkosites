import dotenv from "dotenv";
import { Client } from "@notionhq/client";
import { Account, InstagramImage, convertAccountToNotion, convertImageToNotion, convertNotionToAccount, convertNotionToImage } from "./database.types";

dotenv.config();

const ACCOUNTS_ID = "ea66fc93c0f44c168679944c3ccc4c0c"
const IMAGES_ID = "4e7a0e6d298546a9a26dcf2aaa31de12"

const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export const getAllAccounts = async (): Promise<Account[]> => {
    const response = await notion.databases.query({
        database_id: ACCOUNTS_ID,
    });

    return response.results.map(convertNotionToAccount);
}

export const getAccount = async (instagramID: string): Promise<Account|null> => {
    const response = await notion.databases.query({
        database_id: ACCOUNTS_ID,
        filter: {
            property: "id",
            title: {
                equals: instagramID,
            }
        }
    });

    if (response.results.length === 0) {
        return null;
    } else {
        return convertNotionToAccount(response.results[0]);
    }
}

export const updateAccount = async (account: Account): Promise<void> => {
    const updatedNotionPage = convertAccountToNotion(account);


    await notion.pages.update({
        page_id: account.notionId,
        ...updatedNotionPage,
    })
}

export const createAccount = async (account: Account): Promise<void> => {
    const newNotionPage = convertAccountToNotion(account);

    await notion.pages.create({
        parent: {
            database_id: ACCOUNTS_ID,
        },
        ...newNotionPage,
    })
}

export const createImage = async (image: InstagramImage, account: Account): Promise<void> => {
    const newNotionPage = convertImageToNotion(image, account);

    const result = await notion.pages.create({
        parent: {
            database_id: IMAGES_ID
        },
        ...newNotionPage,
    })

    // Now add the image URL as an Image block to the page

    await notion.blocks.children.append({
        block_id: result.id,
        children: [
            {
                object: "block",
                type: "image",
                image: {
                    type: "external",
                    external: {
                        url: image.media_url,
                    }
                }
            }
        ]
    })
}

export const getImage = async (imageID: string): Promise<InstagramImage|null> => {
    const response = await notion.databases.query({
        database_id: IMAGES_ID,
        filter: {
            property: "id",
            title: {
                equals: imageID,
            }
        }
    });
    
    if (response.results.length === 0) {
        return null;
    } else {
        return convertNotionToImage(response.results[0]);
    }
}

export const getAllImages = async (accountId: string): Promise<InstagramImage[]> => {
    const response = await notion.databases.query({
        database_id: IMAGES_ID,
        filter: {
            property: "account",
            relation: {
                contains: accountId,
            }
        }
    });

    return response.results.map(convertNotionToImage);
}

export const updateImage = async (image: InstagramImage, account: Account): Promise<void> => {
    const updatedNotionPage = convertImageToNotion(image, account);

    await notion.pages.update({
        page_id: image.notionId,
        ...updatedNotionPage,
    })
}

export const createOrUpdateImage = async (image: InstagramImage, account: Account): Promise<void> => {
    const existingImage = await getImage(image.id);
    if (existingImage) {
        image.notionId = existingImage.notionId;
        await updateImage(image, account);
    } else {
        await createImage(image, account);
    }
}