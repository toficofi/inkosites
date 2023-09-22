import { createImageCache, saveImageToCache } from "./cache";
import { createAccount, createImage, createOrUpdateImage, getAccount, getAllAccounts, updateAccount, getAllImages as getAllImagesFromNotion, getAllImages, getImage } from "./database";
import { createEmptyAccount } from "./database.types";
import { getAllImages as getAllImagesFromInstagram, getInstagramProfile } from "./instagram";
import { triggerBuild } from "./netlify";

const main = async () => {
    const account = await getAccount("megan");

    const accessToken = account?.instagramAccessToken;

    console.log(`Fetching gallery for ${account?.instagramHandle} from Instagram...`)
    const images = await getAllImagesFromInstagram(accessToken!);
    createImageCache()
    
    console.log(`Checking ${images.length} images...`)

    for (const image of images) {
        await saveImageToCache(image)
        const existingImage = await getImage(image.id);

        if (!existingImage) {
            console.log(`New image: ${image.id}, saving...`)
            await createImage(image, account!);
        }
    }
}

main()