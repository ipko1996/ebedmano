/**
 * Image to text conversion
 */

export async function imageToText(image: Buffer) {
  return Buffer.from(image).toString('base64');
}
