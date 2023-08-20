import { createAccount, createImage, createOrUpdateImage, getAccount, getAllAccounts, updateAccount, getAllImages as getAllImagesFromNotion, getAllImages } from "./database";
import { createEmptyAccount } from "./database.types";
import { getAllImages as getAllImagesFromInstagram, getInstagramProfile } from "./instagram";

const main = async () => {
    const account = await getAccount("megan");

    const accessToken = account?.instagramAccessToken;

    const images = await getAllImagesFromInstagram(accessToken!);

    for (const image of images) {
        await createOrUpdateImage(image, account!);
    }
}

main()