import axios from 'axios';
import { Config, TemplateOptions, MailOptions } from './types';

let host: string = null;
let apiKey: string = null;

export const init = (config: Config) => {
  host = `${config.host}/api` || 'https://app.muil.io/api';
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
  responseType,
}: TemplateOptions) => {
  ensureInitialized();

  const { data } = await axios.post(
    `${host}/templates/${branch}/${templateId}?type=${type}`,
    { props },
    {
      headers: { 'x-api-key': apiKey },
      responseType: responseType ?? type === 'html' ? 'json' : 'arraybuffer',
    },
  );

  return data;
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
};
