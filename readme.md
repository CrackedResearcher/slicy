# slicy - image resizer  

a queue based image resizing tool, built for speed ⚡️

<img width="1440" alt="Screenshot 2025-04-13 at 8 19 09 PM" src="https://github.com/user-attachments/assets/46104716-702f-48c5-bf37-88b609fb27cf" />


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

<img width="1440" alt="Screenshot 2025-04-13 at 8 20 15 PM" src="https://github.com/user-attachments/assets/99b35ce2-7c3d-4ae6-8be5-ee585c53b6ff" />
<img width="1440" alt="Screenshot 2025-04-13 at 8 20 23 PM" src="https://github.com/user-attachments/assets/6515ed7d-aefb-46a8-a4d2-5687d35f17cb" />
<img width="1440" alt="Screenshot 2025-04-13 at 8 20 32 PM" src="https://github.com/user-attachments/assets/cb3f5997-578b-47a4-8465-88cbe1e1d58c" />
<img width="1440" alt="Screenshot 2025-04-13 at 8 20 45 PM" src="https://github.com/user-attachments/assets/fc950e74-4623-45b5-87a4-d5decf1d6233" />


```
you probably dont even need to read any further - becuz images tell you everything
```

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

before running, make sure you install deps:

```bash
cd ui && bun install
cd ../backend && bun install
```

then start it up:

```bash
./entrypoint.sh
```

spins up redis → backend → frontend  
you’re live. go throw some images in! 😎
