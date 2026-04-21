
# NR Data Engineering Training Vault  
  
This repository is a structured Obsidian vault designed to support a 6-month training plan for mastering:  
  
- Snowflake  
- dbt (data build tool)  
- Modern Data Stack architecture  
- Data engineering strategy and decision-making  
  
The content is tailored specifically to the **Tacoma Power Natural Resources Data Delivery architecture**, aligning learning directly with real-world systems and workflows.  
  
---  
  
## Purpose  
  
This vault is not just a collection of notes—it is a **working knowledge system** to:  
  
- Understand the NR data pipeline end-to-end  
- Map concepts directly to our Snowflake + dbt architecture  
- Track weekly progress and learning  
- Capture strategic insights and architectural decisions  
- Build long-term expertise to guide data engineering direction  
  
---  
  
## Architecture Alignment  
  
This training mirrors the NR data platform:  
  
1. **Ingestion Layer**  
- SharePoint `_QUEUE`  
- File assessment and lineage tracking  
  
2. **Snowflake Layer**  
- `PWR_RAW` (staging)  
- `PWR` (intermediate + marts)  
  
3. **dbt Transformation Layer**  
- `stg_` (staging models)  
- `int_` (intermediate models)  
- `mrt_` (mart models)  
- `reg_` (regulatory models)  
- `wrb_` (write-back models)  
- `seeds/` (reference data)  
  
4. **Consumption Layer**  
- Streamlit in Snowflake  
- Tableau dashboards  
- Direct SQL access  
  
---  
  
## Vault Structure  
  
```plaintext  
📁 NR Data Engineering  
│  
├── 00 - Dashboard # Main training dashboard  
├── 01 - Weekly Tracker # Weekly learning logs    
├── 02 - Resources # Compiled Resources
├── 03 - Drawings # Excalidraw drawings
├── 98 - Learning Exercises # Templated Preconstructed Learning Excercises
├── 99 - Templates # Reusable note templates
