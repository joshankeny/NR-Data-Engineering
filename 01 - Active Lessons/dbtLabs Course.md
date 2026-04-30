---
category: dbt
status: in-progress
---
## 🎯 Goals
- Complete dbtLabs' dbt Fundamentals course

## 🧠 Key Concepts
- Everything dbt 

## 🛠 Hands-On
- [x] Section 1
- [ ] Section 2
- [ ] Section 3
- [ ] Section 4
- [ ] Section 5
- [ ] Section 6
- [ ] Section 7
- [ ] Section 8
- [ ] Section 9
## 📚 Resources

resource:: [dbtLabs dbt Fundamentals Course](https://learn.getdbt.com/learn/course/dbt-fundamentals)
resource:: [docs.getdbt.com](https://docs.getdbt.com/?version=1.12)
resource:: 
## ❓ Questions
- [ ] 
- [ ] 

## ⚠️ Risks
- 
- 

# Notes

## Section 2: ADLC
### Learning Objectives

- Explain the analytics development lifecycle.
- Explain the roles on a data team.
- Explain how dbt fits into the modern data stack.
- Understand the structure of a dbt project.

![[dbt basic understanding]]

![[Pasted image 20260429133414.png]]

![[Pasted image 20260429133538.png]]

ADLC - Analytics Development Lifecycle
![[Pasted image 20260429133640.png]]

Data control plane - gives visibility into what's running, what has changed and what is breaking

### **Traditional Data Teams**

- Data engineers are responsible for maintaining data infrastructure and the ETL process for creating tables and views.
- Data analysts focus on querying tables and views to drive business insights for stakeholders.

### **ETL and ELT**

- ETL (extract transform load) is the process of creating new database objects by extracting data from multiple data sources, transforming it on a local or third party machine, and loading the transformed data into a data warehouse.
- ELT (extract load transform) is a more recent process of creating new database objects by first extracting and loading raw data into a data warehouse and then transforming that data directly in the warehouse.
- The new ELT process is made possible by the introduction of cloud-based data warehouse technologies.

### **dbt**

- dbt empowers data teams to leverage software engineering principles for transforming data.
- The focus of this course is to build your analytics engineering mindset and dbt skills to give you more leverage in your work.

**The Analytics Development Lifecycle (ADLC)**

- Provides a structured process for building, testing, reviewing, and deploying analytics.
    
- Encourages iteration and collaboration so teams can confidently move from idea to production.
    
- Aligns data work with software engineering best practices—version control, testing, and continuous improvement.
    

  

**dbt as the Data Control Plane**

- dbt orchestrates and governs the ADLC across your data ecosystem.
    
- It ensures consistency in how data is developed, tested, documented, and deployed.
    
- By serving as the “control plane,” dbt integrates with the modern data stack to enforce trust, scalability, and readiness for AI-driven use cases.

## Section 3: Set Up dbt

### Learning Objectives

- Load training data into your data platform
- Set up your warehouse and repository connections.
- Navigate the dbt platform.
- Complete a simple development workflow in dbt Studio.
