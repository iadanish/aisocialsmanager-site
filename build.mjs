// Generates the static marketocat.com pages. Run `npm run build`, then commit the output.
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

// Iconsax icons (iconsax-react), rendered to inline SVG at build time.
const require = createRequire(import.meta.url);
const { createElement } = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const Iconsax = require('iconsax-react');
const icon = (name, cls = 'h-5 w-5', variant = 'Bulk') =>
  renderToStaticMarkup(createElement(Iconsax[name], { color: 'currentColor', variant })).replace('<svg ', `<svg aria-hidden="true" class="${cls}" `);

const EMAIL = 'hey@marketocat.com';
const UPDATED = 'October 23, 2026';
const mail = `<a href="mailto:${EMAIL}">${EMAIL}</a>`;

const NAV = [
  ['/#how', 'How it works'],
  ['/#features', 'Features'],
  ['/#faq', 'FAQ'],
  ['/contact', 'Contact'],
];

const logo = (size = 'h-9 w-9') =>
  `<img src="/logo.svg" alt="" width="36" height="36" class="${size} rounded-xl bg-white p-0.5">`;

const header = (dark) => `
<header class="${dark ? 'absolute inset-x-0 top-0 z-20' : 'border-b border-slate-200 bg-white'}">
  <div class="wrap flex items-center gap-6 py-4">
    <a href="/" class="flex items-center gap-2.5 text-lg font-extrabold tracking-tight ${dark ? 'text-white' : 'text-ink-950'}">${logo()}<span>Marketo<span class="text-brand-500">cat</span></span></a>
    <nav class="ml-auto hidden items-center gap-7 text-sm font-medium md:flex ${dark ? 'text-slate-300' : 'text-slate-600'}">
      ${NAV.map(([h, t]) => `<a href="${h}" class="transition hover:${dark ? 'text-white' : 'text-ink-950'}">${t}</a>`).join('')}
    </nav>
    <a href="mailto:${EMAIL}?subject=Marketocat%20early%20access" class="ml-auto rounded-full ${dark ? 'border border-white/20 bg-white/10 text-white hover:bg-white/20' : 'bg-ink-950 text-white hover:bg-ink-800'} px-4 py-2 text-sm font-semibold transition md:ml-0">Get early access</a>
  </div>
</header>`;

const footer = `
<footer class="bg-ink-950 text-slate-400">
  <div class="wrap grid gap-10 py-14 md:grid-cols-[3fr_1fr_1fr]">
    <div>
      <a href="/" class="flex items-center gap-2.5 text-lg font-extrabold text-white">${logo()}<span>Marketo<span class="text-brand-500">cat</span></span></a>
      <p class="mt-4 max-w-sm text-sm leading-6">A local-first social media scheduler for teams and freelancers who manage more than one brand.</p>
    </div>
    <div>
      <h3 class="text-sm font-semibold text-white">Product</h3>
      <ul class="mt-4 space-y-2 text-sm">
        <li><a class="hover:text-white" href="/#how">How it works</a></li>
        <li><a class="hover:text-white" href="/#features">Features</a></li>
        <li><a class="hover:text-white" href="/#faq">FAQ</a></li>
        <li><a class="hover:text-white" href="/contact">Contact &amp; support</a></li>
      </ul>
    </div>
    <div>
      <h3 class="text-sm font-semibold text-white">Legal</h3>
      <ul class="mt-4 space-y-2 text-sm">
        <li><a class="hover:text-white" href="/privacy">Privacy Policy</a></li>
        <li><a class="hover:text-white" href="/terms">Terms of Service</a></li>
        <li><a class="hover:text-white" href="/data-deletion">Data Deletion</a></li>
      </ul>
    </div>
  </div>
  <div class="border-t border-white/10">
    <div class="wrap flex flex-wrap justify-between gap-2 py-6 text-xs">
      <p>&copy; 2026 Marketo Cat. All rights reserved.</p>
      <p><a class="hover:text-white" href="mailto:${EMAIL}">${EMAIL}</a></p>
    </div>
  </div>
</footer>`;

const page = (file, { title, desc, path, dark = false }, body) => writeFileSync(file, `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="https://marketocat.com${path}">
<link rel="icon" href="/logo.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icon-512.png">
<meta name="theme-color" content="#0b1324">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Marketocat">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="https://marketocat.com${path}">
<meta property="og:image" content="https://marketocat.com/icon-1024.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Marketo Cat","url":"https://marketocat.com","logo":"https://marketocat.com/icon-1024.png","email":"${EMAIL}","sameAs":["https://www.linkedin.com/company/marketo-cat/"]}</script>
</head>
<body class="bg-white font-sans text-ink-950 antialiased">
${header(dark)}
${body.trim()}
${footer}
</body>
</html>
`);

const slug = (t) => t.toLowerCase().replace(/&amp;/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const legal = (file, meta, heading, body) => {
  const toc = [];
  const withIds = body.replace(/<h2>(.*?)<\/h2>/g, (_, t) => { const id = slug(t); toc.push([id, t]); return `<h2 id="${id}" class="scroll-mt-8">${t}</h2>`; });
  return page(file, meta, `
<main>
  <section class="bg-slate-50 border-b border-slate-200">
    <div class="wrap py-14">
      <p class="text-sm font-semibold uppercase tracking-wider text-brand-600">Marketocat</p>
      <h1 class="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">${heading}</h1>
      <p class="mt-3 text-sm text-slate-500">Last updated: ${UPDATED}</p>
    </div>
  </section>
  <div class="wrap grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
    <article class="legal max-w-4xl">
${withIds.trim()}
    </article>
    ${toc.length ? `<aside class="hidden lg:block"><nav class="sticky top-8 rounded-3xl border border-slate-200 p-6"><p class="text-sm font-bold text-ink-950">On this page</p><ul class="mt-3 space-y-2 text-sm">${toc.map(([id, t]) => `<li><a class="text-slate-600 hover:text-brand-600" href="#${id}">${t}</a></li>`).join('')}</ul></nav></aside>` : ''}
  </div>
</main>`);
};

// ---------- Landing ----------
const NETWORKS = [
  ['LinkedIn', 'Profiles and company pages', '#0a66c2'],
  ['Facebook', 'Pages you manage', '#1877f2'],
  ['Instagram', 'Professional accounts', '#e1306c'],
  ['X', 'Posts and threads', '#0f172a'],
  ['YouTube', 'Videos and Shorts', '#ff0000'],
  ['TikTok', 'Video posts', '#25f4ee'],
];

const FEATURES = [
  ['Multi-brand workspaces', 'Keep each brand’s accounts, drafts, media and calendar separate, and switch between them in one click.', 'Layer'],
  ['One post, every network', 'Write once, then tailor the caption, hashtags and media for each network before it goes out.', 'Edit2'],
  ['Visual calendar', 'See every scheduled post by day and week. Drag to reschedule, or cancel before it publishes.', 'Calendar'],
  ['Local-first by design', 'Content, media and account tokens stay on your computer. No Marketocat server ever sees them.', 'ShieldTick'],
  ['Official APIs only', 'Accounts connect through each platform’s own sign-in (OAuth), and every post uses its official publishing API.', 'Link21'],
  ['Clear publish status', 'See whether each post was published, with a direct link to it, or why a platform rejected it.', 'Flash'],
];

const FAQ = [
  ['Where is my data stored?', 'On your own computer. Marketocat is local-first: posts, media, schedules and access tokens live in a local database. We do not run a server that receives them.'],
  ['Which networks can I publish to?', 'LinkedIn (personal profiles and company pages), Facebook Pages, Instagram professional accounts, X, YouTube and TikTok.'],
  ['Does Marketocat post anything on its own?', 'No. It only publishes posts you wrote and scheduled, to the accounts you picked. It never likes, follows, comments or sends messages.'],
  ['How do I disconnect an account or delete my data?', 'Disconnect the account in Marketocat to delete its tokens, and revoke access in the platform’s settings. Full steps are on our <a class="font-semibold text-brand-600 underline" href="/data-deletion">data deletion page</a>.'],
  ['How much does it cost?', 'Marketocat is in early access. Email us to get started.'],
];

const pill = (t) => `<span class="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-200 backdrop-blur">${t}</span>`;

const mockup = `
<div class="relative mx-auto mt-16 max-w-6xl rounded-[28px] border border-white/15 bg-white/10 p-2 shadow-2xl shadow-black/40 backdrop-blur">
  <div class="overflow-hidden rounded-[22px] bg-white text-left">
    <div class="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3">
      <span class="h-3 w-3 rounded-full bg-red-400"></span><span class="h-3 w-3 rounded-full bg-amber-400"></span><span class="h-3 w-3 rounded-full bg-emerald-400"></span>
      <span class="ml-3 text-sm font-semibold text-slate-700">Acme Coffee</span>
      <span class="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-600">Brand</span>
      <span class="ml-auto hidden text-xs text-slate-400 sm:block">Week of Oct 26</span>
    </div>
    <div class="grid md:grid-cols-[1.1fr_1.4fr]">
      <div class="border-b border-slate-200 p-5 md:border-b-0 md:border-r">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">New post</p>
        <div class="mt-3 rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-700">Our autumn blend is back ☕ Roasted in small batches, ready Monday. Which café should we visit first?</div>
        <div class="mt-3 flex flex-wrap gap-2">
          ${['LinkedIn', 'Instagram', 'Facebook', 'X'].map((n) => `<span class="rounded-full border border-brand-400/60 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 inline-flex items-center gap-1">${icon('TickCircle', 'h-3.5 w-3.5')}${n}</span>`).join('')}
        </div>
        <div class="mt-4 flex items-center justify-between rounded-xl bg-ink-950 px-4 py-3 text-sm text-white">
          <span>Mon, Oct 26 · 9:00 AM</span><span class="rounded-lg bg-brand-500 px-3 py-1 text-xs font-bold">Schedule</span>
        </div>
      </div>
      <div class="p-5">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Calendar</p>
        <div class="mt-3 grid grid-cols-5 gap-2 text-xs">
          ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => `<div class="min-h-28 rounded-xl border border-slate-200 p-2"><p class="font-semibold text-slate-500">${d}</p>${[
            ['bg-brand-100 text-brand-600', '9:00 Autumn blend'],
            ['bg-sky-100 text-sky-700', '12:30 Team spotlight'],
            ['bg-rose-100 text-rose-700', '17:00 Reel: latte art'],
            ['bg-emerald-100 text-emerald-700', '10:00 Hiring post'],
            ['bg-violet-100 text-violet-700', '15:00 Weekend menu'],
          ].filter((_, j) => j === i || (i === 2 && j === 0)).map(([c, t]) => `<p class="mt-2 rounded-lg ${c} px-1.5 py-1 font-medium leading-4">${t}</p>`).join('')}</div>`).join('')}
        </div>
        <div class="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">${icon('TickCircle', 'h-4 w-4 shrink-0')} Published to LinkedIn · Company page · 2 min ago</div>
      </div>
    </div>
  </div>
</div>`;

page('index.html', {
  title: 'Marketocat: local-first social media scheduler for multiple brands',
  desc: 'Marketocat schedules and publishes posts to LinkedIn, Facebook, Instagram, X, YouTube and TikTok for every brand you manage. Local-first: your data stays on your computer.',
  path: '/',
  dark: true,
}, `
<main>
  <section class="relative overflow-hidden bg-ink-950 pb-24 pt-36 text-white">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl"></div>
      <div class="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl"></div>
      <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"></div>
    </div>
    <div class="wrap relative text-center">
      ${pill('Local-first · Multi-brand · 6 networks')}
      <h1 class="mx-auto mt-7 max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">Schedule social posts for <span class="bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-transparent">every brand</span> you run</h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">Plan, write and publish to LinkedIn, Facebook, Instagram, X, YouTube and TikTok from one calendar. Your content and accounts stay on your own computer.</p>
      <div class="mt-9 flex flex-wrap justify-center gap-3">
        <a href="mailto:${EMAIL}?subject=Marketocat%20early%20access" class="rounded-full bg-brand-500 px-7 py-3.5 text-base font-bold text-ink-950 shadow-lg shadow-brand-500/30 transition hover:bg-brand-400">Get early access</a>
        <a href="#how" class="rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10">See how it works ${icon('ArrowDown', 'inline h-4 w-4', 'Linear')}</a>
      </div>
      ${mockup}
    </div>
  </section>

  <section class="border-b border-slate-200 bg-white py-10">
    <div class="wrap">
      <p class="text-center text-sm font-semibold uppercase tracking-wider text-slate-400">Publishes to</p>
      <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        ${NETWORKS.map(([n, d, c]) => `<div class="rounded-2xl border border-slate-200 px-4 py-3"><p class="flex items-center gap-2 font-bold"><span class="h-2.5 w-2.5 rounded-full" style="background:${c}"></span>${n}</p><p class="mt-0.5 text-xs text-slate-500">${d}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section id="how" class="scroll-mt-8 bg-slate-50 py-24">
    <div class="wrap">
      <p class="text-sm font-semibold uppercase tracking-wider text-brand-600">How it works</p>
      <h2 class="mt-2 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">From draft to published in three steps</h2>
      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${[
          ['Connect your accounts', 'Sign in through each network’s official login and choose exactly which pages, channels or profiles Marketocat may post to.'],
          ['Write and schedule', 'Draft a post, attach images or video, tailor it per network, and pick a date and time on the calendar.'],
          ['Marketocat publishes', 'At the scheduled time the post goes out through the official API, and you get a link to the live post.'],
        ].map(([t, d], i) => `<div class="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"><span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950 text-lg font-extrabold text-brand-400">${i + 1}</span><h3 class="mt-5 text-xl font-bold">${t}</h3><p class="mt-2 leading-7 text-slate-600">${d}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section id="features" class="scroll-mt-8 py-24">
    <div class="wrap">
      <div class="max-w-2xl">
        <p class="text-sm font-semibold uppercase tracking-wider text-brand-600">Features</p>
        <h2 class="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Built for people who run more than one brand</h2>
      </div>
      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        ${FEATURES.map(([t, d, icon_]) => `<div class="group rounded-3xl border border-slate-200 p-7 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-lg hover:shadow-brand-500/10"><span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-500 group-hover:text-white">${icon(icon_)}</span><h3 class="mt-5 text-lg font-bold">${t}</h3><p class="mt-2 leading-7 text-slate-600">${d}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="wrap">
    <div class="relative overflow-hidden rounded-[32px] bg-ink-950 px-8 py-14 text-white sm:px-14">
      <div aria-hidden="true" class="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl"></div>
      <div class="relative grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wider text-brand-400">Privacy</p>
          <h2 class="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Your data stays on your computer</h2>
          <p class="mt-4 max-w-xl leading-7 text-slate-300">Marketocat stores posts, media and access tokens locally. It talks only to the networks you connect, only to do what you scheduled. No ads, no tracking, no selling data.</p>
        </div>
        <ul class="space-y-3 text-sm">
          ${['No Marketocat cloud holding your content', 'Tokens never leave your device except to the platform that issued them', 'Disconnect any account to delete its tokens instantly'].map((t) => `<li class="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">${icon('TickCircle', 'h-5 w-5 shrink-0 text-brand-400')}${t}</li>`).join('')}
          <li><a href="/privacy" class="inline-block pt-1 font-semibold text-brand-400 hover:text-brand-100">Read the privacy policy ${icon('ArrowRight', 'inline h-4 w-4', 'Linear')}</a></li>
        </ul>
      </div>
    </div>
  </section>

  <section id="faq" class="scroll-mt-8 py-24">
    <div class="wrap grid gap-10 lg:grid-cols-[1fr_2fr]">
      <div><p class="text-sm font-semibold uppercase tracking-wider text-brand-600">FAQ</p>
      <h2 class="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Questions, answered</h2>
      <p class="mt-4 max-w-sm leading-7 text-slate-600">Something else? Email <a class="font-semibold text-brand-600 underline" href="mailto:${EMAIL}">${EMAIL}</a>.</p></div>
      <div class="divide-y divide-slate-200 rounded-3xl border border-slate-200">
        ${FAQ.map(([q, a]) => `<details class="group p-6"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">${q}<span class="text-brand-500 transition group-open:rotate-45">${icon('Add', 'h-6 w-6', 'Linear')}</span></summary><p class="mt-3 leading-7 text-slate-600">${a}</p></details>`).join('')}
      </div>
    </div>
  </section>

  <section class="wrap pb-24">
    <div class="rounded-[32px] bg-gradient-to-br from-brand-400 to-brand-600 px-8 py-14 text-center sm:px-14">
      <h2 class="text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">Ready to put your posting on autopilot?</h2>
      <p class="mx-auto mt-3 max-w-xl text-ink-900/80">Marketocat is in early access. Tell us about your brands and we’ll get you set up.</p>
      <a href="mailto:${EMAIL}?subject=Marketocat%20early%20access" class="mt-8 inline-block rounded-full bg-ink-950 px-7 py-3.5 font-bold text-white transition hover:bg-ink-800">Email ${EMAIL}</a>
    </div>
  </section>
</main>`);

// ---------- Legal ----------
legal('privacy.html', { title: 'Privacy Policy | Marketocat', desc: 'How Marketocat handles your data.', path: '/privacy' }, 'Privacy Policy', `
<p>This policy explains how Marketocat (the "app"), a social media scheduling application operated by Marketo Cat ("we", "us"), handles information. It applies to the app and to this website, marketocat.com.</p>

<h2>Summary</h2>
<ul>
<li>The app runs on your own computer. Your posts, media, schedules and social account access tokens are stored there.</li>
<li>We do not run a server that receives your social media content or tokens, and we do not sell or share your data.</li>
<li>The app talks directly to the social platforms you connect, only to do what you asked.</li>
</ul>

<h2>Information the app handles</h2>
<p>When you connect a social account, the app receives information from that platform through its official API. This can include:</p>
<ul>
<li>Basic profile information: your name, profile picture and account or user ID.</li>
<li>The pages, company pages, channels or business accounts you choose to connect, with their names and IDs.</li>
<li>An access token (and refresh token, where the platform issues one) that lets the app publish on your behalf.</li>
<li>Status information about posts the app published, such as the post ID and link.</li>
</ul>
<p>You also give the app the content you create: post text, images, videos and scheduling times.</p>

<h2>How the information is used</h2>
<p>The app uses this information only to:</p>
<ul>
<li>show you which accounts and pages are connected;</li>
<li>publish the posts you scheduled, at the time you chose, to the accounts you chose;</li>
<li>show whether a post was published and link to it.</li>
</ul>
<p>The app does not use platform data for advertising, profiling, analytics about other people, or training AI models, and it does not combine it with data from other sources.</p>

<h2>Where it is stored</h2>
<p>All of the above is stored locally on the computer where you run the app, in its local database and media folder. Marketo Cat has no access to it. Data leaves your computer only when the app sends a request you initiated to the relevant platform (for example, uploading a video to YouTube).</p>

<h2>Sharing</h2>
<p>We do not sell, rent or share your information. Content is sent only to the social platform you selected for a post. Your use of each platform is also governed by its own terms and privacy policy, including LinkedIn, Meta (Facebook and Instagram), X, Google (YouTube) and TikTok. YouTube publishing uses the YouTube API Services; see the <a href="https://www.youtube.com/t/terms">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy">Google Privacy Policy</a>.</p>

<h2>Google user data</h2>
<p>The app's use and transfer of information received from Google APIs follows the <a href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>

<h2>Retention and deletion</h2>
<p>Data stays on your computer until you delete it. You can disconnect an account in the app, which deletes its tokens and profile details; delete individual posts; or uninstall the app and delete its data folder to remove everything. You can also revoke the app's access from each platform's own settings. Step-by-step instructions are on the <a href="/data-deletion">Data Deletion</a> page.</p>

<h2>This website</h2>
<p>marketocat.com is a static website. It does not use cookies, analytics or tracking scripts. Our hosting provider, Cloudflare, may process standard technical data such as IP addresses to deliver and protect the site. Pages load the Plus Jakarta Sans font from Google Fonts, which receives your IP address when serving it.</p>
<p>If you email us, we use your email address and message only to reply, and delete them when they are no longer needed.</p>

<h2>Security</h2>
<p>Tokens are stored only on your device and are sent only to the platform that issued them, over HTTPS. Keep your computer and its user account secure, because anyone with access to it can use the app.</p>

<h2>Children</h2>
<p>The app is not intended for anyone under 16.</p>

<h2>Changes</h2>
<p>We may update this policy. The date at the top shows when it was last changed.</p>

<h2>Contact</h2>
<p>Marketo Cat, ${mail}. You can also reach us through our <a href="/contact">contact page</a>.</p>
`);

legal('terms.html', { title: 'Terms of Service | Marketocat', desc: 'Terms of Service for Marketocat.', path: '/terms' }, 'Terms of Service', `
<p>These terms govern your use of Marketocat (the "app"), operated by Marketo Cat ("we", "us"). By installing or using the app, you agree to them.</p>

<h2>The app</h2>
<p>The app lets you write, schedule and publish content to social media accounts you own or manage, including LinkedIn, Facebook, Instagram, X, YouTube and TikTok. It runs on your own computer.</p>

<h2>Your accounts and content</h2>
<ul>
<li>You may connect only accounts, pages and channels you own or are authorized to manage.</li>
<li>You are responsible for the content you publish through the app and for following each platform's terms, community guidelines and policies, and applicable law.</li>
<li>The app publishes only what you schedule. You must not use it for spam, automated engagement, misleading content, or anything that breaks a platform's rules.</li>
<li>By publishing to YouTube you also agree to the <a href="https://www.youtube.com/t/terms">YouTube Terms of Service</a>.</li>
</ul>

<h2>Third-party platforms</h2>
<p>The app depends on APIs provided by third parties. They can change, limit or withdraw access at any time, and we are not responsible for their actions, outages or decisions about your accounts.</p>

<h2>Privacy</h2>
<p>Our <a href="/privacy">Privacy Policy</a> explains how data is handled.</p>

<h2>No warranty</h2>
<p>The app is provided "as is", without warranties of any kind. We do not guarantee that scheduled posts will publish successfully or on time.</p>

<h2>Limitation of liability</h2>
<p>To the extent permitted by law, Marketo Cat is not liable for indirect or consequential damages, lost content, lost profits, or account restrictions arising from your use of the app.</p>

<h2>Ending use</h2>
<p>You can stop using the app at any time by disconnecting your accounts and uninstalling it.</p>

<h2>Changes</h2>
<p>We may update these terms. The date at the top shows when they were last changed. Continuing to use the app means you accept the updated terms.</p>

<h2>Contact</h2>
<p>${mail}</p>
`);

legal('data-deletion.html', { title: 'Data Deletion Instructions | Marketocat', desc: 'How to delete your data from Marketocat.', path: '/data-deletion' }, 'Data Deletion Instructions', `
<p>Marketocat stores your data only on your own computer. Marketo Cat does not hold copies of your social media data on any server, so you control deletion directly.</p>

<h2>1. Disconnect an account in the app</h2>
<ol>
<li>Open Marketocat and go to the brand's <strong>Channels</strong> settings.</li>
<li>Choose the connected account (for example, your Facebook Page or LinkedIn profile) and select <strong>Disconnect</strong>.</li>
<li>The app deletes that account's access token, refresh token and stored profile and page details.</li>
</ol>

<h2>2. Remove the app's access on the platform</h2>
<ul>
<li><strong>Facebook and Instagram:</strong> Facebook Settings &amp; privacy &gt; Settings &gt; Apps and websites &gt; find Marketocat &gt; Remove. When you remove the app, Meta stops sharing data with it.</li>
<li><strong>LinkedIn:</strong> Settings &gt; Data privacy &gt; Permitted services &gt; Marketocat &gt; Remove.</li>
<li><strong>Google / YouTube:</strong> <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a> &gt; Marketocat &gt; Remove access.</li>
<li><strong>X:</strong> Settings &gt; Security and account access &gt; Apps and sessions &gt; Connected apps &gt; Marketocat &gt; Revoke.</li>
<li><strong>TikTok:</strong> Settings and privacy &gt; Security &gt; Apps and services permissions &gt; Marketocat &gt; Remove access.</li>
</ul>

<h2>3. Delete everything</h2>
<p>To delete all data, including posts, media and schedules, uninstall the app and delete its data folder on your computer.</p>

<h2>Need help or want confirmation?</h2>
<p>Email ${mail} with the subject "Data deletion request". We will reply within 30 days, confirm that we hold no copy of your platform data on our systems, and help you delete it from your device. Any email correspondence we hold about you will also be deleted on request.</p>
`);

legal('contact.html', { title: 'Contact and Support | Marketocat', desc: 'Contact Marketo Cat for Marketocat support, privacy and data requests.', path: '/contact' }, 'Contact and support', `
<p>Marketocat is made by <strong>Marketo Cat</strong>. We usually reply within 2 business days.</p>
<div class="not-prose my-8 grid gap-4 sm:grid-cols-2">
  <a href="mailto:${EMAIL}" class="block rounded-3xl border border-slate-200 p-6 no-underline transition hover:border-brand-400 hover:shadow-lg">${icon('Sms', 'h-8 w-8 text-brand-500')}<p class="text-sm font-semibold uppercase tracking-wider text-brand-600">Email</p><p class="mt-1 text-lg font-bold text-ink-950">${EMAIL}</p></a>
  <a href="https://www.linkedin.com/company/marketo-cat/" class="block rounded-3xl border border-slate-200 p-6 no-underline transition hover:border-brand-400 hover:shadow-lg">${icon('Profile2User', 'h-8 w-8 text-brand-500')}<p class="text-sm font-semibold uppercase tracking-wider text-brand-600">LinkedIn</p><p class="mt-1 text-lg font-bold text-ink-950">Marketo Cat</p></a>
</div>
<h2>What to include</h2>
<ul>
<li>Support: what you were trying to do, which network, and any error message.</li>
<li>Privacy or data deletion: put "Data deletion request" in the subject. See <a href="/data-deletion">Data Deletion Instructions</a>.</li>
</ul>
<h2>Policies</h2>
<p><a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Service</a></p>
`);
