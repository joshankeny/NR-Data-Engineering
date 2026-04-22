#  NR Data Engineering Training Dashboard

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
WHERE !completed AND contains(meta(section).subpath, "Questions") AND text != ""
SORT file.name ASC
```

---
## ⚠️ Risks

```dataview  
TASK  
FROM "01 - Weekly Tracker"  
WHERE !completed AND contains(meta(section).subpath, "Risks") AND text != ""
SORT file.name ASC
```