import { FileHelper } from "./FileHelper";
import fs from "fs";

export class Scaffolder {

    constructor() {}

    copyFeaturesStructureToCurrentDirectory() {
        if (FileHelper.instance().pathExists(`${process.cwd()}/features`)) {
            throw new Error('ERROR: Features directory already exists'); 
        }

        FileHelper.instance().copyFolderToPath(
            `${__dirname}/../../features-skeleton`, `${process.cwd()}/`
        );
    }
}