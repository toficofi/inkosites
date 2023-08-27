import dotenv from "dotenv";
import fetch from "node-fetch";
import { InstagramImage } from "./database.types";
import { writeFileSync, existsSync, mkdirSync } from "fs";
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
    const json = await response.json();
    return Promise.all(json.data.filter((image: InstagramImage) => image.media_type === "IMAGE").map(processInstagramImage))
}

export const processInstagramImage = async (image: InstagramImage): Promise<InstagramImage> => {
    const probeResult = await probe(image.media_url)

    image.width = probeResult.width.toString()
    image.height = probeResult.height.toString()

    return image
}

export const saveImageToCache = async (image: InstagramImage): Promise<InstagramImage> => {
    // Download image and save it locally to /image-cache

    const imageUrl = image.media_url

    const response = await fetch(imageUrl)
    const buffer = await response.buffer()

    const fileName = image.id + ".jpg"
    const filePath = `./image-cache/${fileName}`

    writeFileSync(filePath, buffer)

    return image
}

export const createImageCache = () => {
    if (!existsSync(IMAGE_CACHE_DIR)) {
        mkdirSync(IMAGE_CACHE_DIR)
    }
}

export const getCacheURL = (image: InstagramImage): string => {
    return `${IMAGE_CACHE_DIR}/${image.id}.jpg`
}