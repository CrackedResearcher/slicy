# slicy - image resizer  

a queue-based image resizing tool, built for speed ⚡️

<img width="1440" alt="Screenshot 2025-04-13 at 7 54 33 PM" src="https://github.com/user-attachments/assets/43ddc466-829f-4e75-9c7c-04c186ab0dba" />

---

## tech stack

- **bun** – runtime (blazingly fast)  
- **hono** – backend framework  
- **bullmq** – job queue  
- **sharp** – image resizing + webp conversion  
- **redis** – job storage  
- **react** – frontend  

---

## how it works

you upload an image → it gets queued → resized into multiple sizes → saved as `.webp` → served to you via urls.

### the flow

1. **upload** – image hits the backend  
2. **queue** – job added to **bullmq**  
3. **process** – **sharp** resizes it in the background  
4. **store** – saved to `public/images/<jobId>`  
5. **respond** – returns urls of resized images  

<img width="1440" alt="Screenshot 2025-04-13 at 7 55 12 PM" src="https://github.com/user-attachments/assets/86718937-8ff5-421c-8c02-6a1a091cb9f7" />  
<img width="1440" alt="Screenshot 2025-04-13 at 7 54 23 PM" src="https://github.com/user-attachments/assets/61d41b84-bf55-4f8d-b232-49bf6240777d" />

---

## features

- **multiple sizes** – customize resize steps (90px, 120px, etc.)  
- **async processing** – doesn't block anything  
- **served as static** – use the URLs anywhere  

---

## why it slaps

- **bun** makes it ridiculously fast  
- **sharp** is memory efficient 

---

## run it

requires macOS (uses `brew` in `entrypoint.sh`, tweak for other OS)

```bash
./entrypoint.sh
```

spins up redis → backend → frontend
you’re live. go throw some images in. 😎
