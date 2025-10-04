import { Injectable } from "@nestjs/common";
import { join } from "path";
import { writeFile } from "fs/promises";
import { readFile } from "fs/promises";
import { promises as fs, mkdir } from "fs";

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File, folder: string) {
    const uploadFolder = join(__dirname, "..", "..", "static", folder);

    // console.log(folder);

    let pathTo: string = "";

    try {
      await fs.access(uploadFolder).catch(async () => {
        await fs.mkdir(uploadFolder, { recursive: true });
      });

      const filePath = join(uploadFolder, file.originalname);
      await fs.writeFile(filePath, file.buffer);
      pathTo = `\\${folder}\\${file.originalname}`;
    } catch (error) {
      console.error(`Error writing file ${file.originalname}:`, error);
    }

    return pathTo;
  }

  async uploadFiles(files: Express.Multer.File[]) {}

  async getFile(pathTo: string, username?: string) {
    let filePath: string = "";

    if (!username) {
      filePath = join(process.cwd(), `/static/${pathTo}`);
    } else {
      filePath = join(process.cwd(), `/static/${username}/${pathTo}`);
    }

    const buffer = await readFile(filePath);

    return buffer.toString("base64");
  }
}
