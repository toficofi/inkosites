import { existsSync, mkdirSync, writeFileSync } from "fs"
import fetch from "node-fetch";
import { InstagramImage } from "./database.types"
import { IMAGE_CACHE_DIR } from "./consts"

export const saveImageToCache = async (image: InstagramImage): Promise<InstagramImage> => {
    // Download image and save it locally to /image-cache
    const fileName = image.id + ".jpg"
    const filePath = `./image-cache/${fileName}`

    // Check if image exists
    if (existsSync(filePath)) {
        return image
    }

    const imageUrl = image.media_url

    const response = await fetch(imageUrl)
    const buffer = await response.buffer()

    writeFileSync(filePath, buffer)

    return image
}

export const createImageCache = () => {
    if (!existsSync(IMAGE_CACHE_DIR)) {
        mkdirSync(IMAGE_CACHE_DIR)
    }
}

export const getCacheURL = (image: InstagramImage): string => {
    return `/${IMAGE_CACHE_DIR}/${image.id}.jpg`
}