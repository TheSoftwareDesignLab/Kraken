import fs from "fs";
import fse from "fs-extra";
import glob from "glob";
import path from "path";

export class FileHelper {
  private static singletonInstance: FileHelper;

  private constructor() { }

  public static instance(): FileHelper {
    if (!FileHelper.singletonInstance) {
        FileHelper.singletonInstance = new FileHelper();
    }
    return FileHelper.singletonInstance;
  }

  pathExists(path: string): boolean {
    return fs.existsSync(path);
  }

  deleteFilesWithGlobPattern(globPattern: string) {
    glob(globPattern, {}, (err: any, files: any) => {
      if(err) {
        throw err;
      }
      
      files.forEach((filePath: any) => {
        this.deleteFileInPath(filePath);
      });
    });
  }

  deleteFileInPath(path: string) {
    fs.unlinkSync(path);
  }

  deleteFileInPathIfExists(path: string) {
    if(this.pathExists(path)) {
      this.deleteFileInPath(path);
    }
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

  createFileIfDoesNotExist(path: string) {
    if (!fs.existsSync(path)) {
      fs.openSync(path, 'w');
    }
  }

  contentOfFile(path: string): any {
    const contents = fs.readFileSync(path, 'utf8');
    return contents;
  }

  appendTextToFile(text: string, path: string) {
    fs.appendFileSync(path, `${text}\n`);
  }

  isValidApk(apkPath: string): Boolean {
    return apkPath.slice(apkPath.length - 4) === '.apk';
  }

  pathToAbsolutePath(filePath: string): string {
    return path.resolve(filePath);
  }
}
