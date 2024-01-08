// import { Menu } from '@prisma/client';
// import { prismaClient } from '@ebedmano/prisma-client';
// import { createWebDriver, getElement } from '@ebedmano/kitchenware';
// import { By } from 'selenium-webdriver';
// import axios from 'axios';
// import { writeFileSync } from 'fs';

import { processImage } from '@ebedmano/kitchenware';
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

  if (!table.headerRows?.length) return;
  if (!table.headerRows[0].cells) return;
  if (!table.bodyRows?.length) return;
  if (!table.bodyRows[0].cells) return;

  for (const headerCell of table.headerRows[0].cells) {
    if (!headerCell.layout?.textAnchor) continue;
    const headerCellText = getText(headerCell.layout.textAnchor, text);
    headerRowText += `${JSON.stringify(headerCellText.trim())} | `;
  }
  console.log(
    `Collumns: ${headerRowText.substring(0, headerRowText.length - 3)}`
  );
  // Print first body row
  let bodyRowText = '';
  for (const bodyCell of table.bodyRows[0].cells) {
    if (!bodyCell.layout?.textAnchor) continue;
    const bodyCellText = getText(bodyCell.layout.textAnchor, text);
    bodyRowText += `${JSON.stringify(bodyCellText.trim())} | `;
  }
  console.log(
    `First row data: ${bodyRowText.substring(0, bodyRowText.length - 3)}`
  );
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

export const getCurrentOffer = async () => {
  const processedImage = processImage('temp/zona.jpg');
  console.log(processedImage.document?.pages?.length);
  const { document } = processedImage;

  if (!document) return 'zona';
  if (!document?.pages) return 'zona';

  const { text } = document;

  for (const page of document.pages) {
    if (!page.tables) continue;
    if (!page.formFields) continue;
    console.log(`\n\n**** Page ${page.pageNumber} ****`);

    console.log(`Found ${page.tables.length} table(s):`);
    for (const table of page.tables) {
      if (!table.headerRows) continue;
      if (!table.bodyRows) continue;
      if (table.headerRows[0].cells?.length !== 0) continue;

      const numCollumns = table.headerRows[0].cells.length;
      const numRows = table.bodyRows.length;
      console.log(`Table with ${numCollumns} columns and ${numRows} rows:`);
      printTableInfo(table, text as string);
    }
    console.log(`Found ${page.formFields.length} form field(s):`);
    for (const field of page.formFields) {
      const fieldName = getText(
        field.fieldName
          ?.textAnchor as google.cloud.documentai.v1.Document.ITextAnchor,
        text as string
      );
      const fieldValue = getText(
        field.fieldValue
          ?.textAnchor as google.cloud.documentai.v1.Document.ITextAnchor,
        text as string
      );
      console.log(
        `\t* ${JSON.stringify(fieldName)}: ${JSON.stringify(fieldValue)}`
      );
    }
  }

  return 'zona';
};
