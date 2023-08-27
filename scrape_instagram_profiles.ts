import { createAccount, createImage, createOrUpdateImage, getAccount, getAllAccounts, updateAccount, getAllImages as getAllImagesFromNotion, getAllImages, getImage } from "./database";
import { createEmptyAccount } from "./database.types";
import { createImageCache, getAllImages as getAllImagesFromInstagram, getInstagramProfile, saveImageToCache } from "./instagram";

const main = async () => {
    const account = await getAccount("megan");

    const accessToken = account?.instagramAccessToken;

    console.log(`Fetching gallery for ${account?.instagramHandle} from Instagram...`)
    const images = await getAllImagesFromInstagram(accessToken!);

    console.log("Downloading images to cache...")

    createImageCache()
    
    for (const image of images) {
        const existingImage = await getImage(image.id);

        if (!existingImage) {
            await saveImageToCache(image)
            await createImage(image, account!);
        }
    }
}

main()