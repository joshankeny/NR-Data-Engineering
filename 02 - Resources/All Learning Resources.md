# 📚 All Learning Resources

```dataview  
TABLE resource as "Link"  
FROM "01 - Weekly Tracker"  
FLATTEN resource  
WHERE resource AND resource != ""  
SORT file.name ASC  
```