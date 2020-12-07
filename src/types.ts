export type Config = { host?: string; apiKey: string };

export type TemplateOptions = {
  templateId: string;
  branch?: string;
  type?: 'html' | 'pdf' | 'png';
  props: object;
};

export type MailOptions = {
  from?: string;
  to?: string | Array<string>;
  cc?: string | Array<string>;
  bcc?: string | Array<string>;
  subject: string;
  attachments?: Attachment[];
};

export type Attachment =
  | ({ filename: string } & TemplateOptions)
  | { filename: string; content: string }
  | { filename: string; path: string };

export class HttpError extends Error {
  constructor(private statusCode: number, message: string) {
    super(message);
  }
}
