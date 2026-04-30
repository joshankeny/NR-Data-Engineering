
```button
name Start New Exercise
type command
action QuickAdd: Select from Remaining Lessons
```

## 📊 Training Progress by Category
```dataviewjs
const pages = dv.pages('"01 - Active Lessons" or "98 - Potential Lessons"')
  .where(p => p.category)
  .array();

const groups = {};

for (const p of pages) {
  const category = String(p.category).toLowerCase();

  if (!groups[category]) {
    groups[category] = {
      complete: 0,
      inProgress: 0,
      remaining: 0,
      total: 0
    };
  }

  groups[category].total += 1;

  if (p.status === "complete") {
    groups[category].complete += 1;
  } else if (p.status === "in-progress") {
    groups[category].inProgress += 1;
  } else if (p.status === "remaining" || p.status === "incomplete" || p.status === "Incomplete") {
    groups[category].remaining += 1;
  }
}

const rows = Object.entries(groups)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([category, g]) => {
    const percent = g.total === 0 ? 0 : Math.round((g.complete / g.total) * 100);

    const blocks = 10;
    const filled = Math.round((g.complete / g.total) * blocks);
    const bar = "🟩".repeat(filled) + "⬜".repeat(blocks - filled);

    return [
      category,
      g.complete,
      g.inProgress,
      g.remaining,
      `${bar}`
    ];
  });

dv.table(
  ["Category", "Complete", "In Progress", "Remaining", "Progress"],
  rows
);
```

## 📅 Progress

```dataview
table status as "Status", file.mtime as "Last Updated"
from "01 - Active Lessons"
sort status desc
```

---
## ❓ Open Questions

```dataview  
TASK  
FROM "01 - Active Lessons"  
WHERE !completed AND contains(meta(section).subpath, "Questions") AND text != ""
SORT file.name ASC
```

---
## ⚠️ Risks

```dataview  
TASK  
FROM "01 - Active Lessons"  
WHERE !completed AND contains(meta(section).subpath, "Risks") AND text != ""
SORT file.name ASC
```