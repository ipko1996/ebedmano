import { createWebDriver, getElement } from '@ebedmano/kitchenware';
import { By } from 'selenium-webdriver';
import axios from 'axios';
// import { writeFileSync } from 'fs';

import { Offer, processImage } from '@ebedmano/kitchenware';
import { google } from '@google-cloud/documentai/build/protos/protos';
import { logger } from '@ebedmano/kitchenware';
import dayjs from 'dayjs';
import hu from 'dayjs/locale/hu';

dayjs.locale({
  ...hu,
  weekStart: 1,
});

export const RESTAURANT_DATA = {
  name: 'Zona',
  city: 'Veszprém',
  uniqueId: 'VESZ_ZONA',
} as const;

const FACEBOOK_URL = 'https://www.facebook.com/zonaetterem/';
const FEED_IMAGE_SELECTOR = '//*[@id=":rd:"]/div[1]/a';
const QUALITY_IMAGE_SELECTOR = '.x85a59c.x193iq5w.x4fas0m.x19kjcj4';

const getImage = async () => {
  const driver = await createWebDriver();
  let image: string | undefined;
  try {
    console.log('Navigating to Facebook');
    await driver.get(FACEBOOK_URL);
    const lastImg = await getElement(driver, FEED_IMAGE_SELECTOR);
    const urlToQualityImage = await lastImg.getAttribute('href');
    console.log(urlToQualityImage);
    await driver.get(urlToQualityImage);
    const qualityImage = await getElement(
      driver,
      QUALITY_IMAGE_SELECTOR,
      By.css
    );
    const qualityImageUrl = await qualityImage.getAttribute('src');
    const response = await axios.get(qualityImageUrl, {
      responseType: 'arraybuffer',
    });
    image = Buffer.from(response.data, 'binary').toString('base64');
  } catch (error) {
    console.log(error);
  } finally {
    await driver.quit();
  }
  return image;
};

type Line = Array<string>;
type Lines = Array<Line>;

const getLines = (
  table: google.cloud.documentai.v1.Document.Page.ITable,
  text: string
) => {
  // Print header row
  if (!table.headerRows?.[0]?.cells || !table.bodyRows?.length) {
    throw new Error('Wrong structure');
  }

  let lines: Lines = [];
  let line: Line = [];

  for (const headerCell of table.headerRows[0].cells) {
    if (!headerCell.layout?.textAnchor) continue;
    const headerCellText = getText(headerCell.layout.textAnchor, text);
    line = [...line, JSON.stringify(headerCellText.trim()).replace(/"/g, '')];
  }
  lines = [...lines, line];
  line = [];

  for (const bodyRows of table.bodyRows) {
    if (!bodyRows.cells) continue;
    for (const bodyCell of bodyRows.cells) {
      if (!bodyCell.layout?.textAnchor) continue;
      const bodyCellText = getText(bodyCell.layout.textAnchor, text);
      line = [...line, JSON.stringify(bodyCellText.trim()).replace(/"/g, '')];
    }
    lines = [...lines, line];
    line = [];
  }
  return lines;
};

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
  if (!dateStrArr) throw new Error('Wrong structure');

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

const getOffers = (text: string, lines: Lines) => {
  const { from } = getDateFromTo(text);

  // Check if the menu is for the current week
  if (dayjs(from).isAfter(dayjs().endOf('week'))) {
    throw new Error('Menu is not for the current week');
  }

  let isMenu = false;
  let isDay = true;
  const startDay = dayjs(from);
  let i = 0;
  let offers: Offer[] = [];
  for (const line of lines) {
    // In case of empty line
    if (line[1].length === 0 || line[2].length === 0) continue;

    if (line[0].length > 0) {
      isDay = !isDay;
      isMenu = !isMenu;
    }

    const offer = {
      day: startDay.add(i, 'day').toDate(),
      foodName: line[1],
      price: parseInt(line[2]),
    };
    offers = [...offers, offer];
    if (isDay && !isMenu) {
      i++;
      isDay = true;
      isMenu = false;
    }
  }
  return offers;
};

export const getCurrentOffer = async (): Promise<{
  offers: Offer[];
  succsess: boolean;
  message?: string;
}> => {
  const image = await getImage();
  logger.info('Getting new offer from Zona');
  let processedImage;
  try {
    processedImage = await processImage(image as string);
  } catch (error) {
    logger.error(error);
    return {
      offers: [],
      succsess: false,
      message: 'Error while processing image',
    };
  }

  const { document } = processedImage;

  if (!document?.pages || !document.text) {
    return {
      offers: [],
      succsess: false,
      message: 'Wrong structure, no pages found',
    };
  }

  const { text, pages } = document;
  const page = pages[0];
  const table = page.tables?.[0];
  if (!table)
    return {
      offers: [],
      succsess: false,
      message: 'Wrong structure, no table found',
    };

  let lines: Lines;

  let offers: Offer[];

  try {
    lines = getLines(table, text);
    offers = getOffers(text, lines);
  } catch (error: unknown) {
    logger.error(error);
    if (error instanceof Error) {
      return {
        offers: [],
        succsess: false,
        message: error.message,
      };
    }
    return {
      offers: [],
      succsess: false,
      message: 'Error while processing data',
    };
  }

  return { offers, succsess: true };
};
