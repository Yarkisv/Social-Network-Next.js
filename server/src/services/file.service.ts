import { Injectable } from "@nestjs/common";
import { extname, join } from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File, folder: string) {
    const uploadFolder = join(process.cwd(), "static", folder);

    try {
      await fs.mkdir(uploadFolder, { recursive: true });

      // const uniqueName = Date.now() + extname(file.originalname);
      const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
      const filePath = join(uploadFolder, uniqueName);

      if (!file.buffer) {
        throw new Error("File buffer is undefined");
      }

      await fs.writeFile(filePath, file.buffer);

      return `${folder}/${uniqueName}`;
    } catch (error) {
      console.error(`Error writing file ${file.originalname}:`, error);
      throw error;
    }
  }
}
