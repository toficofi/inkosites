import dotenv from "dotenv";
import fetch from "node-fetch";
import { InstagramImage } from "./database.types";
import probe from "probe-image-size"
import { IMAGE_CACHE_DIR } from "./consts";

dotenv.config();

const LIMIT = 50
const ROOT = "https://graph.instagram.com";
const IMAGE_FIELDS = "id,caption,media_type,media_url,timestamp";

export const getInstagramProfile = async (accessToken: string): Promise<any> => {
    const response = await fetch(`${ROOT}/me?fields=id,username&access_token=${accessToken}`);
    const json = await response.json();
    return json;
}

export const getAllImages = async (accessToken: string): Promise<InstagramImage[]> => {
    const response = await fetch(`${ROOT}/me/media?fields=${IMAGE_FIELDS}&limit=${LIMIT}&access_token=${accessToken}`);

    if (response.status !== 200) {
        console.error(response);
        throw new Error("Failed to fetch images from Instagram");
    }

    const json = await response.json();

    if (json.error) {
        console.error(json.error);
    }

    return Promise.all(json.data.filter((image: InstagramImage) => image.media_type === "IMAGE" || image.media_type === "CAROUSEL_ALBUM").map(probeInstagramImage))
}

export const probeInstagramImage = async (image: InstagramImage): Promise<InstagramImage> => {
    const probeResult = await probe(image.media_url)

    image.width = probeResult.width.toString()
    image.height = probeResult.height.toString()

    return image
}