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
- [x] Section 2
- [x] Section 3
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

[Snowflake 120 Day Trial Account](https://signup.snowflake.com/?trial=student)

```
**Snowflake Code snippets**

create warehouse transforming; 

create database raw; 

create database analytics; 

create schema raw.jaffle_shop; 

create schema raw.stripe;

_________________________________________________________________________

create table raw.jaffle_shop.customers 
( id integer,
  first_name varchar,
  last_name varchar
);

_________________________________________________________________________

copy into raw.jaffle_shop.customers (id, first_name, last_name)
from 's3://dbt-tutorial-public/jaffle_shop_customers.csv'
file_format = (
    type = 'CSV'
    field_delimiter = ','
    skip_header = 1
    );

_________________________________________________________________________

create table raw.jaffle_shop.orders
( id integer,
  user_id integer,
  order_date date,
  status varchar,
  _etl_loaded_at timestamp default current_timestamp
);
_________________________________________________________________________

copy into raw.jaffle_shop.orders (id, user_id, order_date, status)
from 's3://dbt-tutorial-public/jaffle_shop_orders.csv'
file_format = (
    type = 'CSV'
    field_delimiter = ','
    skip_header = 1
    );

_________________________________________________________________________

create table raw.stripe.payment 
( id integer,
  orderid integer,
  paymentmethod varchar,
  status varchar,
  amount integer,
  created date,
  _batched_at timestamp default current_timestamp
);
_________________________________________________________________________

copy into raw.stripe.payment (id, orderid, paymentmethod, status, amount, created)
from 's3://dbt-tutorial-public/stripe_payments.csv'
file_format = (
    type = 'CSV'
    field_delimiter = ','
    skip_header = 1
    );

_________________________________________________________________________

select * from raw.jaffle_shop.customers; 

select * from raw.jaffle_shop.orders; 

select * from raw.stripe.payment;
```

## Section 4
### Learning Objectives

- Explain what models are in a dbt project.
- Build your first dbt model.
- Explain how to apply modularity to analytics with dbt.
- Modularize your project with the ref function.
- Review a brief history of modeling paradigms.
- Identify common naming conventions for tables.
- Reorganize your project with subfolders.

Models
- How your data is shaped between raw data and our final transformed data
- in dbt SQL select statements 
- Lives in a SQL file in the models directory

```
// first model
with customers as (

    select
        id as customer_id,
        first_name,
        last_name

    from raw.jaffle_shop.customers

),

orders as (

    select
        id as order_id,
        user_id as customer_id,
        order_date,
        status

    from raw.jaffle_shop.orders

),

customer_orders as (

    select
        customer_id,

        min(order_date) as first_order_date,
        max(order_date) as most_recent_order_date,
        count(order_id) as number_of_orders

    from orders

    group by 1

),


final as (

    select
        customers.customer_id,
        customers.first_name,
        customers.last_name,
        customer_orders.first_order_date,
        customer_orders.most_recent_order_date,
        coalesce(customer_orders.number_of_orders, 0) as number_of_orders

    from customers

    left join customer_orders using (customer_id)

)

select * from final
```

Including this in the yaml allows all models to produce either a table or  a view

```
models:

  my_new_project:

    # Applies to all files under models/example/

    example:

      +materialized: table (change to view if we want that)
```

Lineage functionality on dbtLabs is nice! Maybe we can recreate that.

![[Pasted image 20260430092213.png]]

Modular thinking
- breaking down our process into semantic pieces to build a model
- This allows us to reuse models in different locations so there is less copying
- creating stages and the using them in jinja references allows for this modular building

```
with customers as (

select *
from {{ ref('stg_jaffle_shop__customers') }}

),

orders as (

select *
from {{ ref('stg_jaffle_shop__orders') }}

),

customer_orders as (
    select
        customer_id,
        min(order_date) as first_order_date,
        max(order_date) as most_recent_order_date,
        count(order_id) as number_of_orders
    from orders
    group by 1

),

final as (
    select
        customers.customer_id,
        customers.first_name,
        customers.last_name,
        customer_orders.first_order_date,
        customer_orders.most_recent_order_date,
        coalesce(customer_orders.number_of_orders, 0) as number_of_orders
    from customers
    left join customer_orders using (customer_id)
)

select * from final
```

![[Pasted image 20260430093321.png]]

**Staging**: Connected to sources and we are getting new records in our sources. It should be a view so it executes every time we update the stage.

**Marts:** Should be tables as they are the most down stream table and are queried by BI tools. If it were a view it would have to be executed every time the BI tool queries it. As a table it does not rerun the query everytime.

![[Pasted image 20260430140414.png]]


