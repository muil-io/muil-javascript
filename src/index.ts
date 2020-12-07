import axios from 'axios';
import FormData from 'form-data';
import { Config, TemplateOptions, MailOptions, HttpError } from './types';

let host: string = null;
let apiKey: string = null;

export const init = (config: Config) => {
  host = config.host || 'https://app.muil.io';
  apiKey = config.apiKey;
};

const ensureInitialized = () => {
  if (!apiKey) {
    throw new Error('Service is not initialized (please init it by calling the init function)');
  }
};

export const generate = async ({
  templateId,
  branch = 'master',
  props,
  type = 'html',
}: TemplateOptions) => {
  ensureInitialized();

  try {
    const { data } = await axios.post(
      `${host}/templates/${branch}/${templateId}?type=${type}`,
      { props },
      { headers: { 'x-api-key': apiKey } },
    );
    return data;
  } catch ({
    response: {
      data: { statusCode, message },
    },
  }) {
    throw new HttpError(statusCode, message);
  }
};

export const sendMail = async ({
  templateId,
  branch = 'master',
  props,
  from,
  to,
  cc,
  bcc,
  subject,
  attachments,
}: TemplateOptions & MailOptions) => {
  ensureInitialized();
  try {
    await axios.post(
      `${host}/templates/${branch}/${templateId}/email`,
      {
        from,
        to,
        cc,
        bcc,
        subject,
        props,
        attachments,
      },
      { headers: { 'x-api-key': apiKey } },
    );
  } catch ({
    response: {
      data: { statusCode, message },
    },
  }) {
    throw new HttpError(statusCode, message);
  }
};

export const uploadAsset = async (fileName: string, value: any) => {
  ensureInitialized();
  try {
    const bodyData = new FormData();
    bodyData.append('file', value, { filename: fileName });

    const {
      data: {
        data: { url },
      },
    } = await axios.post(`${host}/assets/${fileName}`, bodyData, {
      headers: { ...bodyData.getHeaders(), 'x-api-key': apiKey },
    });

    return url;
  } catch ({
    response: {
      data: { statusCode, message },
    },
  }) {
    throw new HttpError(statusCode, message);
  }
};

export const deleteAsset = async (fileName: string) => {
  ensureInitialized();
  try {
    await axios.delete(`${host}/assets/${fileName}`, {
      headers: { 'x-api-key': apiKey },
    });
  } catch ({
    response: {
      data: { statusCode, message },
    },
  }) {
    throw new HttpError(statusCode, message);
  }
};
