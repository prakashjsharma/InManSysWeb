# 📦 InManSys Web – Inventory Management System (ASP.NET Core Web API + MVC UI)

A full-stack Inventory Management System built using ASP.NET Core Web API, MVC Core, jQuery, Bootstrap, and SQL Server, designed for managing suppliers, categories, products, and dashboards with charts and KPIs.

# 🚀 Features
# 1. RESTful API (ASP.NET Core Web API)

CRUD operations for:

Suppliers

Categories

Products (with image upload)

Auto-generated fields (Status, Creation Dates, etc.)

Validations using DataAnnotations

Structured API responses & proper error handling

Clean separation of API and UI

# 2. Web UI (ASP.NET MVC Core + jQuery)

Fully responsive UI using Bootstrap 5

DataTables for listing Suppliers, Categories, Products

Highcharts Dashboard:

Total Suppliers / Categories / Products (KPIs)

Product Count by Supplier (Column Chart)

Product Count by Category (Column Chart)

Image preview before upload

Modal-based CRUD operations

Toast notifications (Success / Error)

AJAX-based data loading

# 3. File Upload Handling

Product image upload using IFormFile

Image saved to /wwwroot/uploads/products

Auto directory creation

Old image replaced on update

# 4. Database Layer (Entity Framework Core)

Code-first models

Foreign key relationships

EF Core migrations

LINQ joins for dashboard data

Optimized queries with AsNoTracking()

# 🏗 Tech Stack
# Frontend

HTML5, CSS3

Bootstrap 5

JavaScript / jQuery

DataTables.js

Highcharts.js

# Backend

ASP.NET Core MVC

ASP.NET Core Web API

C#

Entity Framework Core

# Database

SQL Server

Code-first EF migrations

# Tools

Visual Studio 2022

SSMS

Git / GitHub

Postman

# 📁 Project Structure

InManSysWeb/
│
├── Controllers/
│   ├── API/
│   │    ├── SupplierController.cs
│   │    ├── CategoryController.cs
│   │    ├── ProductsController.cs
│   │    └── DashboardController.cs
│   └── MVC Views (UI)
│
├── wwwroot/
│   ├── uploads/products/
│   ├── js/
│   │   ├── Suppliers.js
│   │   ├── Category.js
│   │   ├── Products.js
│   │   └── Dashboard.js
│
├── Models/
│   ├── Supplier.cs
│   ├── Category.cs
│   └── Products.cs
│
└── Data/
    └── ApplicationDbContext.cs

# 🔗 API Endpoints (RESTful)

# Suppliers
GET    /api/suppliers
GET    /api/suppliers/{id}
POST   /api/suppliers
PUT    /api/suppliers/{id}
DELETE /api/suppliers/{id}

# Categories
GET    /api/category
GET    /api/category/{id}
POST   /api/category
PUT    /api/category/{id}
DELETE /api/category/{id}

# Products
GET    /api/products
GET    /api/products/{id}
POST   /api/products     (multipart/form-data with image)
PUT    /api/products/{id}
DELETE /api/products/{id}

# Dashboard
GET /api/dashboard/kpi
GET /api/dashboard/products-by-supplier
GET /api/dashboard/products-by-category
GET /api/dashboard/products-table

# 📊 Dashboard Visuals
## KPIs
- Total Suppliers
- Total Categories
- Total Products

## Charts (Highcharts)
- Products Count by Supplier
- Products Count by Category

## DataTable
- Supplier | Category | Product | Price | View Details (with image modal)

# 📸 Product Module Features
Create, Edit, Delete products
Upload product image
Show image preview before upload
Show image in table
Show full product details in modal
Supplier & Category dropdowns
Full validation & API error handling

# ⚙️ Setup Instructions
1️⃣ Clone Repository
- git clone https://github.com/prakashjsharma/InManSysWeb.git

2️⃣ Update Database Connection (appsettings.json)
- "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=InManSysWeb;Trusted_Connection=True;"
  }

3️⃣ Run EF Core Migrations
- Add-Migration Initial
- Update-Database

4️⃣ Run Application
- Press F5 in Visual Studio.

# 🧑‍💻 About This Project
This project was created as part of a real production-styled inventory management workflow similar to hypermarket merchandising systems (Tamimi, LULU, etc.).
It uses RESTful Web APIs, proper architecture, clean UI, and dashboard analytics.

# 📄 License
This project is open source and available under the MIT License.

# Screenshots section
# Home
<img width="1366" height="638" alt="image" src="https://github.com/user-attachments/assets/f409a751-80e8-43c3-a041-7d269991f7b6" />

# Get
<img width="1366" height="391" alt="image" src="https://github.com/user-attachments/assets/c0a46aa3-c957-436c-ae86-8023fdb79e4e" />

# POST
<img width="517" height="554" alt="image" src="https://github.com/user-attachments/assets/c8e962d6-66e2-4d55-a0ab-37c8e26d616a" />

# PUT
<img width="512" height="554" alt="image" src="https://github.com/user-attachments/assets/0b98d0a2-1ecd-4f13-a1f1-623faec3b5f9" />

# DELETE
<img width="516" height="241" alt="image" src="https://github.com/user-attachments/assets/0d4dbfa7-f1fb-4910-bdd2-8107757f0051" />


# Dashboard
<img width="1366" height="610" alt="image" src="https://github.com/user-attachments/assets/a11f8569-c084-4b7a-a89c-bcbf394123ac" />

# Dashboard Products Details
<img width="546" height="535" alt="image" src="https://github.com/user-attachments/assets/65dc4561-58c3-4ca5-8c08-0290b5782c62" />

