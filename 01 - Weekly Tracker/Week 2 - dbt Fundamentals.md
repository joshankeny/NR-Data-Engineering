
## 🎯 Goals
- Understand dbt as transformation engine

## 🧠 Key Concepts
- Models = SQL
- DAG dependencies

## 🛠 Hands-On
- [x] Understand dbt DAG
- [ ] Run dbt (if possible)

## 📚 Resources

resource:: [Data by Design - Michael Kahan](https://www.skool.com/moderndata/classroom/c0d4f299?md=d4a0718adcfb4249a9ef4451f31685f2)
resource:: [The Missing Piece in Many Data Pipelines (Staging)](https://www.youtube.com/watch?v=z_TrtkJKXoA&t=28s)
resource:: [dbt Project From Scratch with Claude Code](https://www.skool.com/moderndata/create-a-dbt-project-from-scratch-w-claude-code)
resource:: [Jason dbt Repo](https://github.com/Tacoma-Public-Utilities/pwr_gnr_datadelivery_dbtsandbox)
## ❓ Questions
- [ ] 

## ⚠️ Risks
- [ ] 

## NOTES

DAG - Directed Acyclic Graph

# Introduction

![[Pasted image 20260421150031.png]]

The Three Pillars of Data Engineering:
	Sources
		Source data from API, business applications, raw data files (.csv, .txt)
	Central Hub
		Transforms data to insights
		Ingestion, Modeling, workflow
	Insights
		No point in doing this if we can't understand what the data means (Streamlit, Tableau)

Core Components of a data warehouse
	Where are we going to house the data - Snowflake
	How will we get the data there - _Queue folders in fs109_, python or power automate
	How will we clean it up - dbt
		90% of the work is in the data modeling and transformation
		Three layer approach: staging, warehouse, mart
	Version Control - github
	Transformation - dbt

# Ingestion

Ingestion - How will we get the data from sources to the database

Ingestion just moves the data from the sources into the RAW database not to production ready

Individual schemas for each source
	ESRI has a schema
	*_QUEUE folders have their own raw schema ??*
	![[Pasted image 20260421150107.png]]
	*Should we ingest into cloud storage first as a backup or are we relying on users to correctly store their originals?*

# Modeling

DRY - Don't repeat yourself
### Staging
Staging Schema
	1:1 **Views** ontop of source tables
		Prevents the need to double up storage
		Cleaned data sitting ontop of raw data
		One place where changes are made to raw data so it flows through to and downstream dependencies
	![[Pasted image 20260421150115.png]]
	![[Pasted image 20260421150123.png]]
	STG Prefix notifies users that it is only a staging doc. It may have light transformations but not complex joins
	This allows complex downstream queries to be easily parsed out and understood
	Use stages to rename columns, format columns (dates and numbers)
	*If a one to one change is made downstream to a table, always thing, "Can that be moved back to the staging layer view"*
	
### Warehouse
Star Schema
Data Vault
One-Big-Table
Hybrid

Assign surrogate keys
Break data into two categories:

Facts (The thing that happened, things we will aggregate or summarize)
	Metrics (numbers)
	Dimension Keys (ability to join through IDs or keys)
	Junk Dimensions (not relevant anywhere else)
	Business Actions (verb)
Dimension (The context around the thing)
	Attributes
	Descriptions
	Slowly Changing Dimensions (SCD) - something that may change over time - employee work location
	Context (adjective, nouns)
![[Pasted image 20260421150304.png]]
![[Pasted image 20260421150308.png]]
### Marts
This is what gets shared out to users and reporting tools
# Workflow

Github for Version Control
	Main will match what we have in snowflake
	Could be automatically deployed or updated every day
	We should never commit changes directly to main
	Could create a dev branch for each feature change
	Dev schema in snowflake
	Pull request review to go from dev to main
		Some of this can be automated
			Ci or Cd (continuous deployment) automation that run dbt tools for verification
		Sometimes it is better to have another team member double check it

![[Pasted image 20260421150316.png]]
# Security

Database Security

Users and Roles
	Users get assigned a role, that role has access to objects
	This allows or the quick addition/removal of users and change of permissions to an object as opposed to giving each user distinct permissions to each distinct object