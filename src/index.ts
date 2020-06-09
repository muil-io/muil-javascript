import axios from 'axios';
import { Config, TemplateOptions, MailOptions } from './types';

const baseUrl = 'https://us-central1-muil-dev.cloudfunctions.net/v1';

let apiKey: string = null;
let projectId: string = null;

export const init = (config: Config) => {
  apiKey = config.apiKey;
  projectId = config.projectId;
};

export const generate = async ({
  templateId,
  branch = 'master',
  props,
  type = 'html',
}: TemplateOptions) => {
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
