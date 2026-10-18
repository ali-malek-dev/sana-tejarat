# Brief — Sana Tejarat (سنا تجارت)

Extracted from the original design (`docs/reference/original-design.png`). This is the
context every design and content decision is checked against.

## The business

A Tehran-based **international trade consultancy**: it handles the paperwork and
logistics around getting goods into and out of Iran. Tagline on the logo:
*Import | Export | Customs*.

| Service | What it covers (from the design) |
|---|---|
| واردات — Imports | ثبت سفارش (order registration), تخصیص ارز (currency allocation), ترخیص کالا (clearance), حمل‌ونقل (transport) |
| صادرات — Exports | export process, documents, transport, export customs |
| خدمات گمرکی — Customs | clearance, اظهارنامه (customs declaration), ارزش‌گذاری (valuation), تعرفه (tariffs) |
| اخبار و قوانین — News & regulations | customs/trade news, official بخشنامه (circulars) |
| آموزش و مقالات — Education | guides, explainers of regulation changes |
| Calculators | تعرفه گمرکی (tariff), هزینه حمل (freight), ارزش گمرکی (customs value), حقوق ورودی (import duties) |

Claims shown: **+15 years**, **+500 clients** (individuals and companies), **+1000 shipments**, **100% commitment to quality and transparency**.
Contact placeholders: `021-12345678`, `info@sanatejarat.com`, an address in Tehran, and LinkedIn, Instagram, Telegram and WhatsApp.

## Audience

- Iranian importers/exporters: SME owners and procurement staff, often first-time
  importers who find the process opaque and risky.
- Companies comparing consultancies, who look for credibility signals: years, volume, and clarity.
- Readers looking for regulation news and how-to articles (an SEO and trust channel).

Language: **Persian (RTL) first**. The design shows an `FA` switch, so English comes later.

## The site's job

1. Make a confusing, bureaucratic process feel **handled**, and show the path end to end.
2. Convert visitors into a **free consultation** request (the primary CTA in the design).
3. Be a place the owner updates regularly with news and articles. That needs a
   CMS a non-technical person can use; see [WORDPRESS.md](WORDPRESS.md).

## Tone

Official, trustworthy and calm, but modern. It is a consultancy, not a shipping line:
the hero is the *client's shipment*, not the company's fleet.

## Open questions for the owner

- [ ] Real logo files (SVG); the prototype uses a placeholder container mark.
- [ ] Real numbers for the stats, address, phone and social links.
- [ ] Calculator formulas and default rates. The prototype computes
      CIF = FOB + freight + insurance, duty = CIF × rate, and VAT = (CIF + duty) × VAT rate,
      with rates entered by the visitor. **The owner must confirm this is the correct way to present it.**
- [ ] Is English needed at launch?
- [ ] Featured photos for news and articles (the layout works without them).
