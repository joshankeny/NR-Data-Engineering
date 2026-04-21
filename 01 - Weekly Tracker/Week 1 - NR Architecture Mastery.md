# Week 1 - NR Architecture Mastery

## 🎯 Goals
- Understand all 7 layers of your architecture
- Trace data end-to-end
- Understand lineage deeply

## 🧠 Key Concepts
- Pipeline layers (intake → staging → dbt → marts → apps)
- Lineage ID as system backbone
- Separation of concerns

## 🛠 Hands-On
- [ ] Trace 1 dataset from _QUEUE → mrt_
- [ ] Identify staging + mart tables
- [ ] Locate lineage_id

## 📚 Resources

resource:: [(DRAFT) NR DataProgram_TechnicalArchitecture_v1.docx](https://cityoftacoma.sharepoint.com/:w:/r/teams/TeamPWR-GENNRServicesDelivery/Shared%20Documents/Data%20Delivery/2026%20Data%20Project/1.%20Governance%20Documentation/\(DRAFT\)%20NR%20DataProgram_TechnicalArchitecture_v1.docx?d=w32a8408920fe44179cfbe4a9862ed7bd&csf=1&web=1&e=PXTIC8) 
## ❓ Questions
- [x] How are we handling APIs
	- Added to the architecture
	

## ⚠️ Risks
- [ ] Overcomplicated System - Users will not adopt it
	- We can make the parts they interact with simple (i.e. _QUEUEs for uploads, marts for accessing data)
