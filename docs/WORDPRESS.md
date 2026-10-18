# WordPress plan

## Is WordPress the right call?

Yes, for this owner. The deciding factors:

- She will mainly **publish news and articles** and occasionally edit contact details.
  That is exactly what the WordPress editor is good at, and the admin is fully in Persian.
- WordPress has the largest Persian ecosystem: Jalali dates, Persian plugins, and plenty of
  local hosts and freelancers if she ever needs help without us.

## How to keep it easy (and unbreakable) for her

1. **Custom classic theme, not a page builder.** No Elementor or Divi. A builder would fight the
   3D scene, slow the site down, and give her a thousand ways to break the layout. The layout lives in code;
   she edits *content*.
2. **Give her an `Editor` account, not `Administrator`.** She can write posts and pages, but
   cannot install plugins, switch themes or break settings. Keep the admin account separate.
3. **Content model:**
   | What | Where she edits it |
   |---|---|
   | News, regulations, articles | Posts, with categories اخبار تجاری / قوانین و بخشنامه‌ها / مقالات آموزشی |
   | Services | Pages (one per service) |
   | Phone, email, address, socials, stats | Appearance → Customize → "Sana Tejarat" panel (native Customizer, no plugin) |
   | Story chapter texts | Same Customizer panel, so the 3D is fixed but the words are editable |
4. **Few plugins**: WP-Parsidate (Jalali dates and Persian fixes), Contact Form 7 (consultation
   form), Rank Math or Yoast (SEO), and the host's backup tool. That's it.

## Theme architecture

```
theme/sana-tejarat/          ← the WordPress theme (PHP)
  style.css  functions.php   ← enqueues the Vite build via its manifest
  front-page.php             ← the markup from index.html, with Customizer values
  single.php  archive.php  page.php  search.php  404.php
  inc/customizer.php  inc/vite.php
  assets/dist/               ← output of `npm run build:theme`
src/                         ← shared TS/CSS (scene, story, UI), the same code as the prototype
```

`index.html` is the reference markup. Every section maps 1:1 to a template part, so the
prototype and the theme never drift apart.

## Trying it for free before paying for hosting

**WordPress Playground** (`playground.wordpress.net`) runs a full WordPress in the browser.
A *blueprint* link can install our theme zip automatically, so she can click a link and try the
real admin dashboard with no hosting. Locally we use `npx @wp-playground/cli server`, which needs no PHP or Docker.

## Production hosting (when it's time)

Free WordPress hosting isn't suitable for a business site (ads, downtime, no backups). For an
Iranian audience a local host is usually the practical choice (latency, Rial payment, `.ir`
domains through nic.ir). It is the owner's decision; it's noted here only so it isn't a surprise.
