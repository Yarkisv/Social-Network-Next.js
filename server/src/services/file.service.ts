import { Injectable } from "@nestjs/common";
import { join } from "path";
import { readFile } from "fs/promises";
import { promises as fs } from "fs";

@Injectable()
export class FileService {
  async uploadFile(file: Express.Multer.File, folder: string) {
    const uploadFolder = join(
      "D:\\Projects\\OpenCircle\\server\\static\\",
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

  async getFile(pathTo: string, username?: string) {
    const filePath = username
      ? join(process.cwd(), "static", username, pathTo)
      : join(process.cwd(), "static", pathTo);

    const buffer = await readFile(filePath);

    return buffer.toString("base64");
  }
}
