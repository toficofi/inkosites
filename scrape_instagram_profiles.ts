import { EmbedBuilder, WebhookClient } from "discord.js";
import { createImageCache, saveImageToCache } from "./cache";
import {
  createAccount,
  createImage,
  createOrUpdateImage,
  getAccount,
  getAllAccounts,
  updateAccount,
  getAllImages as getAllImagesFromNotion,
  getAllImages,
  getImage,
} from "./database";
import { createEmptyAccount } from "./database.types";
import {
  getAllImages as getAllImagesFromInstagram,
  getInstagramProfile,
} from "./instagram";
import { triggerBuild } from "./netlify";

const main = async () => {
  const account = await getAccount("megan");

  const accessToken = account?.instagramAccessToken;

  console.log(
    `Fetching gallery for ${account?.instagramHandle} from Instagram...`
  );
  
  const images = await getAllImagesFromInstagram(accessToken!);
  createImageCache();

  console.log(`Checking ${images.length} images...`);

  for (const image of images) {
    await saveImageToCache(image);
    const existingImage = await getImage(image.id);

    if (!existingImage) {
      console.log(`New image: ${image.id}, saving...`);
      await createImage(image, account!);

      if (account.messageWebhook) {
        // Discord webhook set, post the image
        console.log(`Posting image to Discord...`);
        const webhookClient = new WebhookClient({
          url: account.messageWebhook,
        });

        const embed = new EmbedBuilder()
          .setTitle("New art!")
          .setDescription(image.caption)
          .setColor(0x00ffff)
          .setImage(image.media_url)
          .setURL(`https://www.instagram.com/${account.instagramHandle}`);

        webhookClient.send({
          username: "zaeki.art",
          embeds: [embed],
        });
      }
    }
  }
};

main();
