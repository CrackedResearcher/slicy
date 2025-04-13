import { Worker, Job } from "bullmq";
import { process_uploaded_image } from "../utils/processor";
import { QJobType } from "../src";

const workerOptions = {
    connection: {
        host: "localhost",
        port: 6379,
    },
};


const workerHandler = async (job: Job<QJobType>) => {
    try {
        console.log("starting to process the job -> ", job.name);
        await process_uploaded_image(job.data);
        console.log("Finished job:", job.name);
    } catch (e) {
        console.error("Error processing job:", e);
    }
}

const worker = new Worker('imgJobQ', workerHandler, workerOptions)

console.log("started off with the worker");