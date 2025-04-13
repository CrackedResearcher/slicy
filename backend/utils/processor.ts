import * as fs from "fs";
import * as path from "path";
import { QJobType } from "../src";
import sharp = require("sharp");

export function process_uploaded_image(job: QJobType) {
    const imgFileData = Buffer.from(job.image.data, 'base64')
    const imgName = job.image.name
    const jobId = job.jobId;
    const outputDir = path.join(__dirname, "../public/images", jobId);
    console.log('Checking if outputDir exists:', outputDir);
    if (!fs.existsSync(outputDir)) {
        console.log('Directory does not exist. Creating...');
        fs.mkdirSync(outputDir, { recursive: true });
    } else {
        console.log('Directory already exists');
    }

    const process_img = (size: number) => {
        const outputPath = path.join(outputDir, `${imgName}-${size}.webp`);
        return sharp(imgFileData)
            .resize(size, size)
            .webp({ lossless: true })
            .toFile(outputPath)
            .then(() => outputPath);
    }

    const sizes = [90, 96, 120, 144, 160, 180, 240, 288, 360, 480, 720, 1440];
    return Promise.all(sizes.map(process_img));
}