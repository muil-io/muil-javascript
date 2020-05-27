import axios from 'axios';

let apiKey: string = null;
let projectId: string = null;

type Config = { apiKey: string; projectId: string };
export const init = (config: Config) => {
  apiKey = config.apiKey;
  projectId = config.projectId;
};

type Attachment =
  | { filename: string; type: string; templateId: string; props: object }
  | { filename: string; content: string }
  | { filename: string; path: string };

type SendProps = {
  from?: string;
  to?: string;
  cc?: string;
  bcc?: string;
  subject: string;
  templateId: string;
  branch?: string;
  props: object;
  attachments?: Attachment[];
};
export const send = async ({
  from,
  to,
  cc,
  bcc,
  subject,
  templateId,
  branch = 'master',
  props,
  attachments,
}: SendProps) => {
  try {
    await axios.post(
      `https://us-central1-muil-io.cloudfunctions.net/v1/templates/${projectId}/${branch}/${templateId}/email`,
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
  } catch (err) {
    // empty block
  }
};
