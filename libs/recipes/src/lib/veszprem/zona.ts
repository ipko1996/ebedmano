// import { Menu } from '@prisma/client';
// import { prismaClient } from '@ebedmano/prisma-client';
// import { createWebDriver, getElement } from '@ebedmano/kitchenware';
// import { By } from 'selenium-webdriver';
// import axios from 'axios';
// import { writeFileSync } from 'fs';

import { Offer, processImage } from '@ebedmano/kitchenware';
import { google } from '@google-cloud/documentai/build/protos/protos';
import dayjs from 'dayjs';

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

type Line = Array<string>;
type Lines = Array<Line>;

const printTableInfo = (
  table: google.cloud.documentai.v1.Document.Page.ITable,
  text: string
) => {
  // Print header row
  let headerRowText = '';

  if (!table.headerRows?.[0]?.cells || !table.bodyRows?.length) {
    throw new Error('No table found');
  }

  let lines: Lines = [];
  let line: Line = [];

  for (const headerCell of table.headerRows[0].cells) {
    if (!headerCell.layout?.textAnchor) continue;
    const headerCellText = getText(headerCell.layout.textAnchor, text);
    line = [...line, JSON.stringify(headerCellText.trim()).replace(/"/g, '')];
    headerRowText += `${JSON.stringify(headerCellText.trim())} | `;
  }
  lines = [...lines, line];
  line = [];
  //console.log(`${headerRowText.substring(0, headerRowText.length - 3)}`);

  let bodyRowText = '';

  for (const bodyRows of table.bodyRows) {
    if (!bodyRows.cells) continue;
    for (const bodyCell of bodyRows.cells) {
      if (!bodyCell.layout?.textAnchor) continue;
      const bodyCellText = getText(bodyCell.layout.textAnchor, text);
      line = [...line, JSON.stringify(bodyCellText.trim()).replace(/"/g, '')];
      bodyRowText += `${JSON.stringify(bodyCellText.trim())} | `;
    }
    //console.log(`${bodyRowText.substring(0, bodyRowText.length - 3)}`);
    lines = [...lines, line];
    bodyRowText = '';
    line = [];
  }
  console.log(lines);
  return lines;
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

const getDateFromTo = (text: string) => {
  const datePattern = /\d{4}\.\s\d{2}\.\d{2}\.\s\d{2}\.\d{2}\./g;
  const dateStrArr = text.match(datePattern);
  if (!dateStrArr) throw new Error('No date found');
  const date = dateStrArr[0].split('.');
  const yearFrom = parseInt(date[0]);
  const monthFrom = parseInt(date[1]) - 1;
  const dayFrom = parseInt(date[2]);
  const yearTo = parseInt(date[0]);
  const monthTo = parseInt(date[3]) - 1;
  const dayTo = parseInt(date[4]);
  return {
    from: new Date(yearFrom, monthFrom, dayFrom),
    to: new Date(yearTo, monthTo, dayTo),
  };
};

export const getCurrentOffer = async (): Promise<Offer[]> => {
  const processedImage = processImage('temp/zona.jpg');
  const { document } = processedImage;

  if (!document?.pages) throw new Error('No table found');

  const datePattern = /\d{4}\.\s\d{2}\.\d{2}\.\s\d{2}\.\d{2}\./g;

  const { text } = document;
  if (!text) throw new Error('No text found');
  const { pages } = document;

  if (!pages.length) throw new Error('No table found');
  const page = pages[0];

  if (!page.tables?.length) throw new Error('No table found');
  const table = page.tables[0];

  const dateStrArr = text.match(datePattern);
  if (!dateStrArr) throw new Error('No date found');

  const { from, to } = getDateFromTo(text);
  console.log(from, to);

  const lines = printTableInfo(table, text as string);
  let isMenu = false;
  let isDay = true;
  const startDay = dayjs(from);
  let i = 0;
  for (const line of lines) {
    // In case of empty line
    if (line[1].length === 0 || line[2].length === 0) continue;

    if (line[0].length > 0) {
      isDay = !isDay;
      isMenu = !isMenu;
    }

    const offer = {
      day: startDay.add(i, 'day').toDate(),
      offer: line[1],
      price: parseInt(line[2]),
    };
    if (isDay && !isMenu) {
      i++;
      isDay = true;
      isMenu = false;
    }

    console.log(offer);
  }

  return [{ day: new Date(), offer: 'Babgulyás', price: 800 }];
};
