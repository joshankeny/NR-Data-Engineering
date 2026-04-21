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

→ [[Week 1 - Architecture]]

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