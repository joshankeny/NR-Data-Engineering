# 🧠 NR Data Engineering Training Dashboard

## 📊 Progress Tracker
- Month 1 (Snowflake + Architecture): 🟢⬜⬜⬜
- Month 2 (dbt Core): ⬜⬜⬜⬜
- Month 3 (Modeling): ⬜⬜⬜⬜
- Month 4 (Ingestion): ⬜⬜⬜⬜
- Month 5 (Performance): ⬜⬜⬜⬜
- Month 6 (Apps + Strategy): ⬜⬜⬜⬜

---

## 📅 Weekly Progress

```dataview
table file.name as "Week", file.mtime as "Last Updated"
from "01 - Weekly Tracker"
sort file.mtime desc
```
___

## 📅 Current Week

```dataviewjs
const pages = dv.pages('"01 - Weekly Tracker"')
  .where(p => /^Week \d+/.test(p.file.name))
  .sort(p => Number(p.file.name.match(/^Week (\d+)/)?.[1] ?? 0), 'desc');

if (pages.length) {
  dv.paragraph(`→ ${pages[0].file.link}`);
} else {
  dv.paragraph("→ No weekly notes found");
}
```

---
## ❓ Open Questions

```dataview  
TASK  
FROM "01 - Weekly Tracker"  
WHERE !completed AND contains(meta(section).subpath, "Questions")  
SORT file.name ASC
```

---
## ⚠️ Risks

```dataview  
TASK  
FROM "01 - Weekly Tracker"  
WHERE !completed AND contains(meta(section).subpath, "Risks")  
SORT file.name ASC
```