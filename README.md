# Portfolio Pixel

Sitio web estatico para mostrar proyectos personales, hablar de ti y enlazar tu Discord. Esta pensado para Railway con un contenedor pequeno de Nginx y sin backend.

## Editar contenido

Abre `script.js` y cambia:

- `name`, `handle`, `role`, `headline` e `intro`
- `about` y `stats`
- `discord.username`, `discord.displayName`, `discord.userId`, `discord.avatarUrl`
- `projects` con tus proyectos reales

Para usar presencia real de Discord, coloca tu `discord.userId`, activa `fetchPresence: true` y usa Lanyard. Si tu avatar de Discord es animado, el sitio usara `.gif` automaticamente cuando Lanyard devuelva un hash animado.

## Ver localmente

Puedes abrir `index.html` directamente en el navegador. Si quieres simular servidor local:

```bash
python -m http.server 8080
```

## Deploy en Railway

Sube estos archivos a un repo de GitHub y conectalo en Railway. Railway detecta el `Dockerfile` de la raiz y el contenedor escucha el puerto que Railway entrega con `PORT`.

Este deploy no ejecuta Node, no compila assets y no mantiene procesos extra: solo sirve archivos estaticos con Nginx.
