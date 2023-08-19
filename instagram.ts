import dotenv from "dotenv";
import fetch from "node-fetch";
import { InstagramImage } from "./database.types";
dotenv.config();

const LIMIT = 50
const ROOT = "https://graph.instagram.com";
const IMAGE_FIELDS = "id,caption,media_type,media_url,timestamp";

export const getInstagramProfile = async (accessToken: string): Promise<any> => {
    const response = await fetch(`${ROOT}/me?fields=id,username&access_token=${accessToken}`);
    const json = await response.json();
    return json;
}

export const getLatestImage = async (accessToken: string): Promise<InstagramImage> => {
    const response = await fetch(`${ROOT}/me/media?fields=${IMAGE_FIELDS}&limit=1&access_token=${accessToken}`);
    const json = await response.json();
    return json.data.filter((image: any) => image.media_type === "IMAGE")[0]
}

export const getAllImages = async (accessToken: string): Promise<InstagramImage[]> => {
    const response = await fetch(`${ROOT}/me/media?fields=${IMAGE_FIELDS}&limit=${LIMIT}&access_token=${accessToken}`);
    const json = await response.json();
    return json.data.filter((image: any) => image.media_type === "IMAGE");
}