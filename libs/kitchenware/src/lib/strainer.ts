/**
 * Image to text conversion
 */

// const { DocumentProcessorServiceClient } = require("@google-cloud/documentai").v1beta3;
import 'dotenv/config';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
// import { readFileSync } from 'fs';
// import mockJson from './../../mock/photo_1_15.json';
// import { google } from '@google-cloud/documentai/build/protos/protos';

const projectId = process.env.PROJECT_ID;
const location = process.env.PROJECT_LOCATION;
const processorId = process.env.PROCESSOR_ID;

const client = new DocumentProcessorServiceClient({
  apiEndpoint: process.env.API_ENDPOINT,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
    client_id: process.env.CLIENT_ID,
  },
});

export async function processImage(base64Image: string) {
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  const request = {
    name,
    rawDocument: {
      content: base64Image,
      mimeType: 'image/jpeg',
    },
  };

  const [result] = await client.processDocument(request);

  // // @ts-ignore
  // result = mockJson as google.cloud.documentai.v1.IProcessResponse;

  return result;
}
