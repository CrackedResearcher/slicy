# image resizer

## tech stack

- **bun** - runtime
- **hono** for backend
- **bullmq** for managing jobs in a queue
- **sharp** for image processing (resizing and converting)
- **redis** for job queue management
- **react** for, you know it, frontend

## how it works

this project is all about resizing images. you send in an image, and it will be processed and resized into various sizes, then saved as webp files and shown to you in the frontend (see below):

### the flow

1. **upload the image**: you upload an image - it gets sent to the backend for processing.
2. **processing**: the image gets added to a job queue using **bullmq**. we process the image in the background using **sharp**, resizing it to multiple sizes (like 90px, 120px, 240px, etc.).
3. **storing**: once resized, the images are saved in a specific folder inside `public/images/<jobId>`. this keeps everything organized.
4. **response**: the backend sends back a list of URLs to access the resized images.

### key feats

- **dynamic resizing**: we can resize the image to multiple sizes (you decide the sizes).
- **background processing**: thanks to **bullmq**, the image processing runs in the background, so your server can keep doing other things while the images are being resized.
- **static serving**: once resized, the images are stored in a public directory and can be accessed via URL.

### why it’s awesome (becus i made it :)

- it’s fast because we use **bun**
- it’s simple. just send in an image, and get resized versions back. you don’t need to mess with complicated image manipulation libraries.
- **sharp** is super efficient and lets us work with images in a memory-friendly way.

so if you need a simple, fast, and efficient image resizing service, this is it. set it up, throw some images at it, and get your resized versions back in no time.

## to run it:

make sure you are using macOS. because we have an `entrypoint.sh` file, and it's going to start services using the brew command. change it to suit your os specific requirements.

then run `./entrypoint.sh`

it will spin up the Redis instance (if not already running), then backend, then frontend, and you're good to go.

mess up with the system now. 😎
