import fs from "fs";
import fse from "fs-extra";

export class FileHelper {
  private static singletonInstance: FileHelper;

  private constructor() { }

  public static instance(): FileHelper {
    if (!FileHelper.singletonInstance) {
        FileHelper.singletonInstance = new FileHelper();
    }
    return FileHelper.singletonInstance;
  }

  directoryPathExists(path: string): boolean {
    return fs.existsSync(path);
  }

  filesInPath(path: string): string[] {
    return fs.readdirSync(path);
  }

  featureFilesInPath(path: string): string[] {
    let filesInFeaturePath: string[] = this.filesInPath(path);
    return filesInFeaturePath.filter((fileName: string) => {
      return fileName.match(/\.feature$/);
    });
  }

  copyFolderToPath(folderPath: string, destinationPath: string) {
    this.createFolderIfDoesNotExist(destinationPath);

    fse.copy(folderPath, destinationPath, (err: any)  => {
      if (err) {
        throw err;
      }
    });
  }

  createFolderIfDoesNotExist(path: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  }
}
