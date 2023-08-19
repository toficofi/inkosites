import { createAccount, createImage, createOrUpdateImage, getAccount, getAllAccounts, updateAccount } from "./database";
import { createEmptyAccount } from "./database.types";
import { getAllImages, getInstagramProfile, getLatestImage } from "./instagram";

const main = async () => {
    const account = await getAccount("megan");
    const accessToken = account?.instagramAccessToken;

    const images = await getAllImages(accessToken!);

    for (const image of images) {
        await createOrUpdateImage(image, account!);
    }
}

main()