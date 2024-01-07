// import { Menu } from '@prisma/client';
// import { prismaClient } from '@ebedmano/prisma-client';
// import { createWebDriver, getElement } from '@ebedmano/spices';
// import { By } from 'selenium-webdriver';
// import axios from 'axios';
// import { writeFileSync } from 'fs';

import { ISomething } from '../../interfaces';

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

export const something: ISomething = {
  getCurrentOffer: () => {
    return 'zona';
  },
};
