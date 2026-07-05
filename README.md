# Tripps to Anywhere

Cape Town trips, handled — private driver, planned routes, everything booked.

Static site: `index.html` (home) + `gallery.html` (photo & video gallery). All media lives in `media/`, and all site content (WhatsApp number, captions, route stops, experiences) is edited in one place: `media.js`.

## Local preview

Any static server works, e.g.:

```
npx serve .
```

## Adding photos or videos

1. Drop the file into `media/`
2. Add one line to the `MEDIA` array in `media.js` with a caption and category (`places` / `people` / `ocean` / `video`)
