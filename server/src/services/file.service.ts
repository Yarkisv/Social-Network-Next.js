import { Injectable } from "@nestjs/common";
import { join } from "path";
import { readFile } from "fs/promises";
import { promises as fs } from "fs";

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File, folder: string) {
    const uploadFolder = join(
      "D:\\Projects\\Social-Network-Next.js\\server\\static\\",
      folder,
    );

    console.log(uploadFolder);

    console.log(folder);

    let pathTo: string = "";

    try {
      await fs.access(uploadFolder).catch(async () => {
        await fs.mkdir(uploadFolder, { recursive: true });
      });

      if (!file.buffer) {
        throw new Error("File buffer is undefined");
      }

      const filePath = join(uploadFolder, file.originalname);
      await fs.writeFile(filePath, file.buffer);
      pathTo = `\\${folder}\\${file.originalname}`;
    } catch (error) {
      console.error(`Error writing file ${file.originalname}:`, error);
    }

    return pathTo;
  }

  // async uploadFiles(files: File[]) {}

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
