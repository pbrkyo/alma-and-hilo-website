# Panel del catálogo (`/admin`)

Permite a una persona no técnica gestionar el catálogo **desde el celular**: crear,
editar y borrar productos, y subir las dos imágenes (la principal del home y las de
la galería). El sitio público sigue siendo **estático**; cada guardado dispara un
**Deploy Hook** y republica en ~1-2 minutos.

## Cómo funciona
- Datos + imágenes viven en **Vercel Blob** (`catalog.json` + `products/*.webp`).
- El sitio lee `catalog.json` en cada build (`lib/catalog.ts`). Sin `CATALOG_URL`
  configurado, cae al catálogo semilla del código — no se rompe nada.
- `/admin` está protegido por una sola contraseña (`ADMIN_PASSWORD`), cookie HMAC,
  via `middleware.ts`.

## Configuración (una sola vez, en el dashboard de Vercel)

1. **Crear el Blob store**: Storage → Create Database → **Blob** → conectarlo al
   proyecto. Esto crea la env `BLOB_READ_WRITE_TOKEN` automáticamente.

2. **Variables de entorno** (Settings → Environment Variables, scope *Production*):
   - `ADMIN_PASSWORD` — la clave que usará la editora.
   - `DEPLOY_HOOK_URL` — crear en Settings → Git → **Deploy Hooks** (branch `master`)
     y pegar la URL que genera.
   - `CATALOG_URL` — se obtiene en el paso 4.

3. **Traer el token al entorno local** (para migrar): `vercel env pull .env.local`
   (o copiar `BLOB_READ_WRITE_TOKEN` del dashboard).

4. **Migrar las imágenes actuales** a Blob (WSL):
   ```bash
   BLOB_READ_WRITE_TOKEN=xxxxx npx tsx scripts/migrate-catalog.ts
   ```
   Sube `public/products/*.webp` y publica `catalog.json`. Al final imprime
   `CATALOG_URL=...` → ponelo como env en Vercel (Production).

5. **Redeploy** para que el build tome `CATALOG_URL`.

6. Listo: entrar a `almayhilo.com/admin`, login con `ADMIN_PASSWORD`.

## Notas
- Modelo de **una sola editora** (lee–modifica–escribe sobre un JSON). Correcto para este caso.
- Las imágenes subidas se procesan a WebP ~1600px (orientación EXIF corregida) antes de guardar.
- `BLOB_READ_WRITE_TOKEN` lo inyecta Vercel en runtime; el código del admin no necesita pasarlo.
- Endurecer a futuro (opcional): rate-limit en login, rotación de clave.
