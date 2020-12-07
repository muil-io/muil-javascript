# JavaScript development for Muil API

## Installation

#### NPM

```sh
npm install @muil/muil-javascript --save
```

#### Yarn

```sh
yarn add @muil/muil-javascript
```

## Initialization

First you have to initialize the service with Api Key and host (if not using our SaaS solution)

```
import muil from '@muil/muil-javascript';

muil.init({ host: 'MY_HOST_ADDRESS', apiKey: 'MY_API_KEY' });
```

## Generate Template

To generate html from template pass templateId and props

```
const html = await muil.generate({
  templateId: 'awesomeTemplate',
  props: { name: 'John' },
});
```

You can also set type to 'pdf' or 'png' to generate PDF or png, functions returns pdf or png as binary string

```
const content = await muil.generate({
  templateId: 'awesomeTemplate',
  type: 'pdf',
  props: { name: 'John' },
});
```

## Send Email from Template

To generate email from template and send it

```
muil.sendMail({
  templateId: 'awesomeTemplate',
  subject: 'This is an awesome mail',
  to: 'mail@example.com',
  props: { name: 'John' },
});
```

- from - The email address of the sender. All email addresses can be plain ‘sender@server.com’ or formatted '“Sender Name” sender@server.com’
- to - Comma separated list or an array of recipients email addresses
- cc - Comma separated list or an array of recipients email addresses
- bcc - Comma separated list or an array of recipients email addresses
- subject - The subject of the email
  Y

## Send Email from Template with Attachment

```
muil.sendMail({
  templateId: 'awesomeTemplate',
  subject: 'This is an awesome mail',
  to: 'mail@example.com',
  props: { name: 'John' },
  attachments: [{
    filename: 'a.png',
    type: 'png',
    templateId: 'awesomeTemplate',
    props: {
      name: 'John',
    }
  },
  {
    filename: 'file.txt',
    content: 'hello world!'
  },
  {
    filename: 'license.txt',
    path: 'https://example.com/license.txt'
  }]
});
```

## Upload Asset

to upload asset to you Muil project bucket

```
await muil.uploadAsset('file.png', value);
```

Value can be a string, a buffer or a file stream.

## Delete Asset

to delete asset from Muil project bucket

```
await muil.deleteAsset('file.png');
```
