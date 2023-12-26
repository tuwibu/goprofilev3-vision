import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const ENDPOINT = process.env.ENDPOINT;
const APIKEY = process.env.APIKEY;

const ocrImage = async(pathFile: string) => {
  try {
    const file = fs.readFileSync(pathFile);
    const response = await axios({
      method: 'post',
      url: `${ENDPOINT}/computervision/imageanalysis:analyze?features=read&model-version=latest&language=en&gender-neutral-caption=false&api-version=2023-10-01`,
      headers: {
        'ocp-apim-subscription-key': APIKEY,
        'Content-Type': 'application/octet-stream'
      },
      data: file
    });
    if (response.data?.readResult) {
      const blocks = response.data?.readResult?.blocks;
      const text = blocks?.map((block: any) => {
        return block.lines?.map((line: any) => {
          return line.words?.map((word: any) => {
            return word.text;
          }).join(' ');
        }).join(' ');
      }).join(' ');
      return text;
    } else {
      throw new Error('No text found');
    }
  } catch(ex) {
    throw ex?.response?.data?.error || ex;
  }
}

export default ocrImage;