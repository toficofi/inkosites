export interface Account {
  id: string;
  notionId?: string;
  instagramHandle?: string;
  instagramAccessToken?: string;
  latestImageID?: string;
  categories?: string;
}

export interface InstagramImage {
    id: string;
    caption?: string;
    media_type?: string;
    media_url?: string;
    ai_title?: string;
    ai_caption?: string;
    timestamp?: string;
    notionId?: string;
    width?: string;
    height?: string;
}

export const createEmptyAccount = (id: string): Account => {
  return {
    // These are properties that will exist in the Notion page. The remaining properties are used internally.
    id: id,
    instagramHandle: undefined,
    instagramAccessToken: undefined,
    latestImageID: undefined,
  };
};

export const createEmptyImage = (id: string): InstagramImage => {
    return {
        id: id,
        caption: undefined,
        media_type: undefined,
        media_url: undefined,
        timestamp: undefined,
        ai_title: undefined,
        ai_caption: undefined,
        width: undefined,
        height: undefined,
    }
}

export const convertNotionToAccount = (notionPage: any): Account => {
  const account = createEmptyAccount(extractProperty(notionPage, "id")!);
  account.notionId = notionPage.id;

  for (const key in account) {
    if (!shouldConvert(key)) continue;
    account[key] = extractProperty(notionPage, key);
  }

  return account;
};

export const convertNotionToImage = (notionPage: any): InstagramImage => {
    const image = createEmptyImage(extractProperty(notionPage, "id")!);
    image.notionId = notionPage.id;

    for (const key in image) {
        if (!shouldConvert(key)) continue;
        image[key] = extractProperty(notionPage, key);
    }

    return image;
}

export const convertAccountToNotion = (account: Account): any => {
  const notionPage = {
    properties: {
      id: {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: account.id,
            },
          },
        ],
      },
    },
  };

  for (const key in account) {
    if (!shouldConvert(key)) continue;
    notionPage.properties[key] = {
      rich_text: [
        {
          type: "text",
          text: {
            content: account[key],
          },
        },
      ],
    };
  }

  return notionPage;
};

export const convertImageToNotion = (image: InstagramImage, account: Account): any => {
    const notionPage = {
        properties: {
            id: {
                type: "title",
                title: [
                    {
                        type: "text",
                        text: {
                            content: image.id,
                        },
                    },
                ],
            },
            account: {
                type: "relation",
                relation: [
                    {
                        id: account.notionId,
                    }
                ]
            }
        },
    };

    for (const key in image) {
        if (!shouldConvert(key)) continue;
        notionPage.properties[key] = {
            rich_text: [
                {
                    type: "text",
                    text: {
                        content: image[key],
                    },
                },
            ],
        };
    }

    return notionPage;
}

export const extractProperty = (
  notionPage: any,
  propertyName: string
): string | undefined => {
  const prop = notionPage.properties[propertyName];

  if (prop.type === "title") {
    return prop.title[0]?.plain_text;
  } else {
    return prop.rich_text[0]?.plain_text;
  }
};

export const shouldConvert = (prop: string): boolean => {
  return prop !== "id" && prop !== "notionId" && prop !== "account"
};
