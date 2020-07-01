// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

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

export class FileUploadController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
  ) {}

  @post('/files', {
    responses: {
      '204': {
        description: 'Uploaded',
      },
    },
  })
  async fileUpload(
    @requestBody({
      description: 'Upload file test',
      required: true,
      content: {
        'multipart/form-data': {'x-parser': 'stream', schema: {type: 'object'}},
      },
    })
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
    console.log(fileArr[0].originalname);

    return 'Yes';
  }

  private static getFilesAndFields(request: Request) {
    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      encoding: f.encoding,
      mimetype: f.mimetype,
      size: f.size,
    });
    let files: object[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }
    return {files, fields: request.body};
  }
}
