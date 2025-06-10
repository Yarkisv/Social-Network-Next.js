import { Injectable } from "@nestjs/common";
import { join } from "path";
import { writeFile } from "fs/promises";
import { readFile } from "fs/promises";

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File) {
    const folder = join(__dirname, "..", "..", "static");

    try {
      await writeFile(join(folder, file.originalname), file.buffer);
    } catch (error) {
      console.error(`Error writing file ${file.originalname}:`, error);
    }
  }

  async uploadFiles(files: Express.Multer.File[]) {
    
  }

  async getFile(pathTo: string) {
    const filePath = join(process.cwd(), `/static/${pathTo}`);
    const buffer = await readFile(filePath);
    return buffer.toString("base64");
  }
}
