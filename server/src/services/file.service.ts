import { Injectable } from "@nestjs/common";
import { join } from "path";
import { writeFile } from "fs/promises";
import { readFile } from "fs/promises";

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File) {
    const folder = join(__dirname, "..", "..", "static");

    let pathTo: string = "";

    try {
      await writeFile(join(folder, file.originalname), file.buffer);
      pathTo = `\\${file.originalname}`;
    } catch (error) {
      console.error(`Error writing file ${file.originalname}:`, error);
    }

    return pathTo;
  }

  async uploadFiles(files: Express.Multer.File[]) {}

  async getFile(pathTo: string) {
    const filePath = join(process.cwd(), `/static/${pathTo}`);
    const buffer = await readFile(filePath);

    return buffer.toString("base64");
  }
}
