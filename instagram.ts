import dotenv from "dotenv";
import fetch from "node-fetch";
import { InstagramImage } from "./database.types";
import probe from "probe-image-size"

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