import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { Config, TemplateOptions, MailOptions } from './types';

const baseUrl = 'https://us-central1-muil-dev.cloudfunctions.net/v1';

let apiKey: string = null;
let projectId: string = null;

export const init = (config: Config) => {
  apiKey = config.apiKey;
  projectId = config.projectId;
};

const ensureInitialized = () => {
  if (!apiKey || !projectId) {
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
      `${baseUrl}/templates/${projectId}/${branch}/${templateId}?type=${type}`,
      {
        props,
      },
    );
    return data;
  } catch ({
    response: {
      data: { error },
    },
  }) {
    throw new Error(error.description ?? error.message);
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
      `${baseUrl}/templates/${projectId}/${branch}/${templateId}/email`,
      {
        from,
        to,
        cc,
        bcc,
        subject,
        props,
        attachments,
      },
      {
        headers: {
          'x-api-key': apiKey,
        },
      },
    );
  } catch ({ response: { data } }) {
    throw new Error(data.error?.description ?? data.error?.message ?? data);
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
    } = await axios.post(`${baseUrl}/assets/${projectId}/${fileName}`, bodyData, {
      headers: { ...bodyData.getHeaders(), 'x-api-key': apiKey },
    });

    return url;
  } catch (err) {
    const {
      response: { data },
    } = err;
    throw new Error(data.error?.description ?? data.error?.message ?? data);
  }
};

export const deleteAsset = async (fileName: string) => {
  ensureInitialized();
  try {
    await axios.delete(`${baseUrl}/assets/${projectId}/${fileName}`, {
      headers: { 'x-api-key': apiKey },
    });
  } catch ({ response: { data } }) {
    throw new Error(data.error?.description ?? data.error?.message ?? data);
  }
};
