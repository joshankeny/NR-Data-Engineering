
## 🎯 Goals
- Understand architectural strategy

## 🧠 Key Concepts
1. **ETL** transforms data before loading — ideal for compliance-heavy, on-prem, or non-SQL use cases.
2. **ELT** loads raw data first and transforms in the warehouse — the dominant pattern for modern cloud data stacks.
3. **Preserve raw data** — it's your safety net for rebuilding transformations.
4. **Most real-world platforms are hybrid** — use the right pattern for each data source.
5. **The choice depends on your infrastructure** — cloud warehouse capabilities, compliance requirements, team skills, and data complexity all factor in.

## 🛠 Hands-On
- [x] Map current structure ETL vs proposed structure ELT
	- ![[Current ETL vs Proposed ELT]]

## 📚 Resources

resource:: [ETL vs ELT: What's the difference?](https://www.getdbt.com/blog/etl-vs-elt)
resource:: [ETL vs ELT: A Complete Guide for Data Engineers](https://dataskew.io/blog/etl-vs-elt)
## ❓ Questions
- [ ] We will primarily operate under ELT in the new architecture. Are there instances you can think of in NR where ETL should still be used (i.e., Cultural Resource data)?
- [ ] 

## ⚠️ Risks
- [ ] 
- [ ] 
# NOTES

ETL - Extract, Transform, Load
	Data is transformed before loading into the warehouse
ELT - Extract, Load, Transform
	Data is transformed after loading into the warehouse

dbt is the Transform
## ETL

![[Pasted image 20260423073506.png]]

## ELT

![[Pasted image 20260423073530.png]]


|                     | ETL                                                                              | ELT                                                                                            |
| ------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Order of Operations | Extract -> Transform -> Load                                                     | Extract -> Load -> Transform                                                                   |
| System Requirements | External Tools (FME in our case) to transform data before reaching the warehouse | Modern data warehouses to handle transformations, reducing the need for complex pre-processing |
| Efficiency          | Slower for large datasets                                                        | Faster for large datasets                                                                      |
| Use Cases           | Used with highly structured environments                                         | Better for unstructured data where transformations happen after it is in the warehouse         |
| Compliance          | Sensitive data filtered before loading                                           | Raw data in warehouse - need column-level security or role based access control                |

We are currently using the ETL approach. We are using FME to transform the data and reformat it before we are loading it into snowflake. This approach has caused issues with the pipelines because the data is not under stringent data governance and changes to structure are causing issues.

## ‼️Huge Win for ETL ‼️

### Data democratization

By loading raw data into the warehouse first, ELT supports a more self-service data model. Analysts and data teams can access and transform data as needed without being bottlenecked by upstream ETL processes. This democratization fosters greater agility and collaboration across teams​.

## Data Privacy and Compliance Requirements

ETL lets you mask, hash, or filter PII before it's loaded. Is this potentially important for Cultural Resource Data?

## Potential ELT Pitfalls
### 1. No Raw Layer Preservation

Always keep an immutable raw layer. Never transform data in place. If a transformation is wrong, you need the original data to rebuild.

```plaintext
raw/          -- Immutable copy of source data
staging/      -- Cleaned, typed, deduplicated
intermediate/ -- Joined, enriched
marts/        -- Business-level metrics and entities
```

### 2. Transforming During Ingestion

If your ELT ingestion tool is doing heavy transformations before loading, you've accidentally built ETL. Keep the "L" clean — load raw data, transform later.

### 3. Ignoring Costs

Cloud warehouses charge for compute. Poorly written transformations or full table scans on massive raw tables can run up your bill. Use incremental models, partition pruning, and materialization strategies wisely.

### 4. No Data Quality Checks

Raw data will have issues. Build tests into your transformation layer:

```sql
-- dbt test: ensure no null order IDs
-- tests/assert_order_id_not_null.sql
SELECT order_id
FROM {{ ref('stg_orders') }}
WHERE order_id IS NULL
```


## Do we need a hybrid approach?

