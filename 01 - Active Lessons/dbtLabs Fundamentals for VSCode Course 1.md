---
category: dbt
status: complete
---
## 🎯 Goals
- Complete dbtLabs' dbt Fundamentals course

## 🧠 Key Concepts
- Everything dbt 

## 🛠 Hands-On
- [x] Section 1
- [x] Section 2
- [ ] Section 3
- [ ] Section 4
- [ ] Section 5
- [ ] Section 6
- [ ] Section 7
- [ ] Section 8
- [ ] Section 9
## 📚 Resources

resource:: [Fundamentals for VSCode JAnkeny repo](https://github.com/joshankeny/dbtLabsVSCodeLesson.git)
resource:: [dbtLabs dbt Fundamentals Course]([https://learn.getdbt.com/learn/course/dbt-fundamentals](https://github.com/joshankeny/dbtLabsVSCodeLesson.git))
resource:: [docs.getdbt.com](https://docs.getdbt.com/?version=1.12)
resource:: [dbt commands](https://docs.getdbt.com/category/list-of-commands)
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

## Section 4: Models
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

### Naming Conventions 

In working on this project, we established some conventions for naming our models.

- **Sources** (`src`) refer to the raw table data that have been built in the warehouse through a loading process. (We will cover configuring Sources in the Sources module)
- **Staging** (`stg`) refers to models that are built directly on top of sources. These have a one-to-one relationship with sources tables. These are used for very light transformations that shape the data into what you want it to be. These models are used to clean and standardize the data before transforming data downstream. Note: These are typically materialized as views.
- **Intermediate** (`int`) refers to any models that exist between final fact and dimension tables. These should be built on staging models rather than directly on sources to leverage the data cleaning that was done in staging.
- **Fact** (`fct`) refers to any data that represents something that occurred or is occurring. Examples include sessions, transactions, orders, stories, votes. These are typically skinny, long tables.
- **Dimension** (`dim`) refers to data that represents a person, place or thing. Examples include customers, products, candidates, buildings, employees.
- Note: The Fact and Dimension convention is based on previous normalized modeling techniques.
## Section 5: Sources

### Learning Objectives

- Explain the purpose of sources in dbt.
- Configure and select from sources in your data platform.
- View sources in the lineage graph.
- Check the last time sources were updated and raise warnings if stale.


![[Pasted image 20260501115341.png]]

**models/staging/jaffle_shop/_src_jaffle_shop.yml**

```yaml
sources:
  - name: jaffle_shop
    database: raw
    schema: jaffle_shop
    tables:
      - name: customers
      - name: orders
```

**models/staging/jaffle_shop/stg_jaffle_shop__customers.sql**

```sql
select 
    id as customer_id,
    first_name,
    last_name
from {{ source('jaffle_shop', 'customers') }}
```

**models/staging/jaffle_shop/stg_jaffle_shop__orders.sql**

```sql
select
    id as order_id,
    user_id as customer_id,
    order_date,
    status
from {{ source('jaffle_shop', 'orders') }}
```

### Sources

- Sources represent the raw data that is loaded into the data warehouse.
- We _can_ reference tables in our models with an explicit table name (`raw.jaffle_shop.customers`).
- However, setting up Sources in dbt and referring to them with the `source`function enables a few important tools.
    - Multiple tables from a single source can be configured in one place.
    - Sources are easily identified as green nodes in the Lineage Graph.
    - You can use `dbt source freshness` to check the freshness of raw tables.

### Configuring sources

- Sources are configured in YML files in the models directory.
- The following code block configures the table `raw.jaffle_shop.customers` and `raw.jaffle_shop.orders`:

```yaml
sources:
  - name: jaffle_shop
    database: raw
    schema: jaffle_shop
    tables:
      - name: customers
      - name: orders
```

- View the full documentation for configuring sources on the [source properties](https://docs.getdbt.com/reference/source-properties) page of the docs.

### Source function

- The `ref` function is used to build dependencies between models.
- Similarly, the `source` function is used to build the dependency of one model to a source.
- Given the source configuration above, the snippet `{{ source('jaffle_shop','customers') }}` in a model file will compile to `raw.jaffle_shop.customers`.
- The Lineage Graph will represent the sources in green.

![](https://media.thoughtindustries.com/course-uploads/6ed554fb-fedc-4719-a40d-8b22e0a22aee/99qy73567d1g-Screenshot2025-09-02at2.52.38PM.png)

### Source freshness

- Freshness thresholds can be set in the YML file where sources are configured. For each table, the keys `loaded_at_field` and `freshness` must be configured.

```yaml
sources:
  - name: jaffle_shop
    database: raw
    schema: jaffle_shop
    tables:
      - name: customers 
      - name: orders
        freshness:
          warn_after:
            count: 12
            period: hour
          error_after: 
            count: 1
            period: day
        loaded_at_field: _etl_loaded_at
```

- A threshold can be configured for giving a warning and an error with the keys `warn_after` and `error_after`.
- The freshness of sources can then be determined with the command `dbt source freshness`.

## Section 6: Data Tests

### Learning Objectives

- Explain why data testing is crucial for analytics.
- Explain the role of data testing in analytics engineering.
- Configure and run generic tests in dbt.
- Write, configure, and run singular tests in dbt.

### dbt tests
- Generic Tests
	Highly scalable and reusable
	Defined in the YAML file
	unique
		Tests that every value is unique
	not_null
		Tests that the values are not null
	accepted_values
		Tests that the values in a column are within our predefined accepted lists
	relationships
		ensure that all values in one column have a corresponding value in the parent tables primary key column

- Singular
	- One off tests written as standalone sql files in the test folder
		- for example: a test might be used to ensure a specific column is never negative

When to test:
	Sources
		We should test sources with basic tests (not_null, unique, accepted values)
		For data integrity
	Models
		We can test these with generic and singular tests
		Transformation integrity

### dbt build command

If we execute 'dbt run' it runs all of our models in DAG order from staging to marts
If we then execute 'dbt test' and find faulty data, it is too late, the data is already incorporated in our models

Enter 'dbt build'
	It processes tests and models in a logical model
		It will start with sources and move through the DAG specifically running each step then their subsequent test
	It halts any time that a test is not passed
	It will not build any models downstream of a failed test

![[Pasted image 20260501133731.png]]

### Testing

- **Testing** is used in software engineering to make sure that the code does what we expect it to.
- In Analytics Engineering, testing allows us to make sure that the SQL transformations we write produce a model that meets our assertions.
- In dbt, tests are written as select statements. These select statements are run against your materialized models to ensure they meet your assertions.

### Tests in dbt

- In dbt, there are two types of tests - generic tests and singular tests:
    - **Generic tests** are a way to validate your data models and ensure data quality. These tests are predefined and can be applied to any column of your data models to check for common data issues. They are written in YAML files.
    - **Singular tests** are data tests defined by writing specific SQL queries that return records which fail the test conditions. These tests are referred to as "singular" because they are one-off assertions that are uniquely designed for a single purpose or specific scenario within the data models.
- dbt ships with four built in tests: unique, not null, accepted values, relationships.
    - **Unique** tests to see if every value in a column is unique
    - **Not_null** tests to see if every value in a column is not null
    - **Accepted_values** tests to make sure every value in a column is equal to a value in a provided list
    - **Relationships** tests to ensure that every value in a column exists in a column in another model (see: [referential integrity](https://en.wikipedia.org/wiki/Referential_integrity))
- Tests can be run against your current project using a range of commands:  
    
- - `dbt test` runs all tests in the dbt project
    - `dbt test --select test_type:generic`
    - `dbt test --select test_type:singular`
    - `dbt test --select one_specific_model`
- Read more here in [testing documentation](https://docs.getdbt.com/reference/node-selection/test-selection-examples).
- In development, dbt will provide a visual for your test results. Each test produces a log that you can view to investigate the test results further.

## Section 7: Documentation

### Learning Objectives

- Explain why documentation is crucial for analytics.
- Understand the documentation features of dbt.
- Write documentation for models, sources, and columns in .yml files.
- Write documentation in markdown using doc blocks.
- View and navigate the lineage graph to understand the dependencies between models.

### Write documentation

- Add documentation to the file `models/staging/jaffle_shop/_stg_jaffle_shop.yml`.
- Add a description for your `stg_jaffle_shop__customers` model and the column `customer_id`.
- Add a description for your `stg_jaffle_shop__orders` model and the column `order_id`.

### Create a reference to a doc block

- Create a doc block for your `stg_jaffle_shop__orders` model to document the `status` column.
- Reference this doc block in the description of `status` in `stg_jaffle_shop__orders`.

**`models/staging/jaffle_shop/_stg_jaffle_shop.yml`**

```yaml
models:
  - name: stg_jaffle_shop__customers
    description: Staged customer data from our jaffle shop app.
    columns: 
      - name: customer_id
        description: The primary key for customers.
        data_tests:
          - unique
          - not_null

  - name: stg_jaffle_shop__orders
    description: Staged order data from our jaffle shop app.
    columns: 
      - name: order_id
        description: Primary key for orders.
        data_tests:
          - unique
          - not_null
      - name: order_status
        description: "{{ doc('order_status') }}"
        data_tests:
          - accepted_values:
              arguments:
                values:
                  - completed
                  - shipped
                  - returned
                  - placed
                  - return_pending
      - name: customer_id
        description: Foreign key to stg_customers.customer_id
        data_tests:
          - relationships:
              arguments:
                to: ref('stg_jaffle_shop__customers')
                field: customer_id
```

**`models/staging/jaffle_shop/_jaffle_shop.md`**

```
{% docs order_status %}
    
One of the following values: 

| status         | definition                                       |
|----------------|--------------------------------------------------|
| placed         | Order placed, not yet shipped                    |
| shipped        | Order has been shipped, not yet been delivered   |
| completed      | Order has been received by customers             |
| return pending | Customer indicated they want to return this item |
| returned       | Item has been returned                           |

{% enddocs %}
```
### Documentation

- Documentation is essential for an analytics team to work effectively and efficiently. Strong documentation empowers users to self-service questions about data and enables new team members to on-board quickly.
- Documentation often lags behind the code it is meant to describe. This can happen because documentation is a separate process from the coding itself that lives in another tool.
- Therefore, documentation should be as automated as possible and happen as close as possible to the coding.
- In dbt, models are built in SQL files. These models are documented in YML files that live in the same folder as the models.

### Writing documentation and doc blocks

- Documentation of models occurs in the YML files (where generic tests also live) inside the models directory. It is helpful to store the YML file in the same subfolder as the models you are documenting.
- For models, descriptions can happen at the model, source, or column level.
- If a longer form, more styled version of text would provide a strong description, **doc blocks** can be used to render markdown in the generated documentation.

## Section 8 Deployment (**Really only relevant to dbtLabs**)

### Learning Objectives

- Understand why it's necessary to deploy your project.
- Explain the purpose of creating a deployment environment.
- Schedule a job in dbt.
- Review the results and artifacts of a scheduled job in dbt.

### Development vs. Deployment

- Development in dbt is the process of building, refactoring, and organizing different files in your dbt project. This is done in a development environment using a development schema (`dbt_jsmith`) and typically on a _non-default_ branch (i.e. feature/customers-model, fix/date-spine-issue). After making the appropriate changes, the development branch is merged to main/master so that those changes can be used in deployment.
- Deployment in dbt (or running dbt in production) is the process of running dbt on a schedule in a deployment environment. The deployment environment will typically run from the _default_ branch (i.e., main, master) and use a dedicated deployment schema (e.g., `dbt_prod`). The models built in deployment are then used to power dashboards, reporting, and other key business decision-making processes.
- The use of development environments and branches makes it possible to continue to build your dbt project _without_ affecting the models, tests, and documentation that are running in production.

### Creating your Deployment Environment

- A deployment environment can be configured in dbt on the Orchestration > Environments page.
- **General Settings:** You can configure which dbt version you want to use and you have the option to specify a branch other than the default branch.
- **Data Warehouse Connection:** You can set data warehouse specific configurations here. For example, you may choose to use a dedicated warehouse for your production runs in Snowflake.
- **Deployment Credentials:**Here is where you enter the credentials dbt will use to access your data warehouse:
    - IMPORTANT: When deploying a real dbt Project, you should set up a **separate data** **warehouse account** for this run. This should not be the same account that you personally use in development.
    - IMPORTANT: The schema used in production should be **different** from anyone's development schema.

### Scheduling a job in dbt

- Scheduling of future jobs can be configured in dbt on the Jobs page.
- You can select the deployment environment that you created before or a different environment if needed.
- **Commands:** A single job can run multiple dbt commands. For example, you can run `dbt run` and `dbt test` back to back on a schedule. You don't need to configure these as separate jobs.
- **Triggers:** This section is where the schedule can be set for the particular job.
- After a job has been created, you can manually start the job by selecting `Run Now`

### Reviewing Jobs

- The results of a particular job run can be reviewed as the job completes and over time.
- The logs for each command can be reviewed.
- If documentation was generated, this can be viewed.
- If `dbt source freshness` was run, the results can also be viewed at the end of a job.

Curious to know more about deploying with dbt? Check out our free online [Advanced Deployment course](https://courses.getdbt.com/courses/advanced-deployment), where you'll learn how to deploy your dbt project with advanced functionality including continuous integration, orchestrating conflicting jobs, and customizing behavior by environment!  

Want to know how to automate and accelerate your dbt workflow? Learn how with our free online course on [Webhooks](https://courses.getdbt.com/courses/webhooks)!