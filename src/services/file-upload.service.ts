import {inject} from '@loopback/core';
import {
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {FILE_UPLOAD_SERVICE} from '../keys';
import {FileUploadHandler} from '../types';
import multer from 'multer';
import path from 'path';

export class FileUploadService {
  constructor() {}

  async fileUpload(
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<string> {
    const storage = multer.diskStorage({
      destination: './public/uploads',
      filename: function (request, file, cb) {
        cb(
          null,
          file.fieldname + '-' + Date.now() + path.extname(file.originalname),
        );
      },
    });
    const upload = multer({storage});
    const fileArr = await new Promise<any[]>((resolve, reject) => {
      upload.any()(<any>request, <any>response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(<any[]>request.files);
        }
      });
    });
    const filePath: string = fileArr[0].destination + '/' + fileArr[0].filename;
    console.log(filePath);

    return filePath;
  }
}
