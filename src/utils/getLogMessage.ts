import { HttpStatus } from '@nestjs/common';

export const getLogMessage = (
  url: string,
  query: any,
  body: any,
  statusCode: HttpStatus,
) => {
  return (
    `URL: ${url}, ` +
    `Query parameters: ${JSON.stringify(query)}, ` +
    `Body: ${JSON.stringify(body)}, ` +
    `Status code: ${statusCode}`
  );
};
