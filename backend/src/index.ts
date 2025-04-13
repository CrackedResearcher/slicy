import { Hono } from 'hono'
import { Queue, Job } from 'bullmq';
import { randomUUIDv7 } from 'bun';
import { serveStatic } from 'hono/bun'
import * as fs from "fs";
import * as path from "path";
import { cors } from 'hono/cors'


export interface QJobType {
  jobId: string,
  type: string;
  image: {
    data: string;
    name: string;
  }
}
const redisOptions = {
  host: 'localhost',
  port: 6379
}

const imageJobQueue = new Queue(
  'imgJobQ', {
  connection: redisOptions
}
)

async function addJob(job: QJobType) {
  await imageJobQueue.add(job.type, job, {
    jobId: job.jobId
  })
}

const app = new Hono()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: false,
}))

app.use('/images/*', serveStatic({ root: './public' }))

app.get('/', async (c) => {
  console.log("triggerd from teh ui");
  return c.json({ text: 'Hello from Bun backend!' })
})

app.post('/api/upload', async (c) => {
  const body = await c.req.parseBody()
  if (!body['file']) {
    return c.json({
      error: 'pls send a file'
    }, 404)
  }

  const file = body['file'] as File;
  if (!file || !(file instanceof File)) {
    return c.json({ error: 'Invalid file' }, 400);
  }

  const imgName = file.name;
  const fileBytes = await file.bytes();
  const base64Image = Buffer.from(fileBytes).toString('base64');
  console.log("user uploaded this file named: ", imgName)

  const jobId = randomUUIDv7();

  await addJob({
    jobId,
    type: 'banana_split',
    image: {
      data: base64Image,
      name: imgName
    }
  })

  return c.json({
    text: 'success uploaded file',
    jobId: jobId
  }, 200)
})


app.get('/api/job-status', async (c) => {
  const id = c.req.query('id') as string;
  const job = await imageJobQueue.getJob(id) as Job<QJobType>;

  if (!job) return c.json({ status: 'not_found' });

  if (job.finishedOn) {
    const jobId = job.id;
    const outputDir = path.join(__dirname, "../public/images", id);

    if (fs.existsSync(outputDir)) {
      const imageFiles = fs.readdirSync(outputDir);

      const imageUrls = imageFiles.map((file) => `/images/${jobId}/${file}`);
      return c.json({ status: 'completed', imageUrls });
    } else {
      return c.json({ status: 'completed', imageUrls: [] });
    }
  }

  return c.json({ status: 'pending' });
});

export default app