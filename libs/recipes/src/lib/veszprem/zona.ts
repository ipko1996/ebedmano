// import { Menu } from '@prisma/client';
// import { prismaClient } from '@ebedmano/prisma-client';
// import { createWebDriver, getElement } from '@ebedmano/kitchenware';
// import { By } from 'selenium-webdriver';
// import axios from 'axios';
// import { writeFileSync } from 'fs';

import { Offer, processImage, weekdays } from '@ebedmano/kitchenware';
import { google } from '@google-cloud/documentai/build/protos/protos';

// const Zona = {
//   name: 'Zona',
//   city: 'Veszprém',
//   uniqueId: 'VESZ_ZONA',
// };
// const FACEBOOK_URL = 'https://www.facebook.com/zonaetterem/';
// const FEED_IMAGE_SELECTOR = '//*[@id=":rb:"]/div[1]/a';
// const QUALITY_IMAGE_SELECTOR = '.x85a59c.x193iq5w.x4fas0m.x19kjcj4';

// export const getCurrentOffer = async (): Promise<Menu[]> => {
//   const restaurant = await prismaClient.restaurant.upsert({
//     where: { uniqueId: Zona.uniqueId },
//     update: {},
//     create: Zona,
//   });
//   console.log(restaurant);

//   const driver = await createWebDriver();
//   try {
//     console.log('Navigating to Facebook');
//     await driver.get(FACEBOOK_URL);
//     const lastImg = await getElement(driver, FEED_IMAGE_SELECTOR);
//     const urlToQualityImage = await lastImg.getAttribute('href');
//     console.log(urlToQualityImage);
//     await driver.get(urlToQualityImage);
//     const qualityImage = await getElement(
//       driver,
//       QUALITY_IMAGE_SELECTOR,
//       By.css
//     );
//     const qualityImageUrl = await qualityImage.getAttribute('src');
//     const response = await axios.get(qualityImageUrl, {
//       responseType: 'arraybuffer',
//     });
//     writeFileSync('temp/zona.jpg', response.data);
//     console.log(qualityImageUrl);
//   } catch (error) {
//     console.log(error);
//   } finally {
//     driver.quit();
//   }

//   return [];
// };

const printTableInfo = (
  table: google.cloud.documentai.v1.Document.Page.ITable,
  text: string
) => {
  // Print header row
  let headerRowText = '';

  if (!table.headerRows?.[0]?.cells || !table.bodyRows?.length) {
    return;
  }

  for (const headerCell of table.headerRows[0].cells) {
    if (!headerCell.layout?.textAnchor) continue;
    const headerCellText = getText(headerCell.layout.textAnchor, text);
    headerRowText += `${JSON.stringify(headerCellText.trim())} | `;
  }
  console.log(`${headerRowText.substring(0, headerRowText.length - 3)}`);

  let bodyRowText = '';

  for (const bodyRows of table.bodyRows) {
    if (!bodyRows.cells) continue;
    for (const bodyCell of bodyRows.cells) {
      if (!bodyCell.layout?.textAnchor) continue;
      const bodyCellText = getText(bodyCell.layout.textAnchor, text);
      bodyRowText += `${JSON.stringify(bodyCellText.trim())} | `;
    }
    console.log(`${bodyRowText.substring(0, bodyRowText.length - 3)}`);
    bodyRowText = '';
  }
};

// Extract shards from the text field
const getText = (
  textAnchor: google.cloud.documentai.v1.Document.ITextAnchor,
  text: string
) => {
  if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
    return '';
  }

  // First shard in document doesn't have startIndex property
  const startIndex = textAnchor.textSegments[0].startIndex || 0;
  const endIndex = textAnchor.textSegments[0].endIndex;

  return text.substring(startIndex as number, endIndex as number);
};

export const getCurrentOffer = async (): Promise<Offer[] | null> => {
  const processedImage = processImage('temp/zona.jpg');
  const { document } = processedImage;

  if (!document?.pages) return null;

  const { text } = document;
  const { pages } = document;

  if (!pages.length) return null;
  const page = pages[0];

  if (!page.tables?.length) return null;
  const table = page.tables[0];

  printTableInfo(table, text as string);

  return [{ day: weekdays.MONDAY, offer: 'Babgulyás', price: 800 }];
};
