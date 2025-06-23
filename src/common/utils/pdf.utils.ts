import * as pdf from 'html-pdf';

export function generatePdfFromHtml(html: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    pdf.create(html).toBuffer((err, buffer) => {
      if (err) return reject(err);
      resolve(buffer);
    });
  });
}
