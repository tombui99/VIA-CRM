# CRM for VIA

This repository contains a full-stack web application built with a **.NET 10 backend**, **MySQL database**, and an **Angular frontend**. The project follows modern development practices, emphasizes clean architecture, and uses well-adopted libraries on both the backend and frontend.

---

## 🧱 Tech Stack Overview

### Backend

- **.NET 10 (ASP.NET Core Web API)**
- **Entity Framework Core**
- **LINQ** for data querying
- **MySQL** as the relational database

### Frontend

- **[Angular 20](https://angular.dev)** framework
- **[Tailwind CSS v4](https://tailwindcss.com)** styling
- **[Spartan](https://ionicframework.com)** base components
- **[Tanstack Query](https://tanstack.com/query/latest/docs/framework/angular/overview)** CRUD
- **[Tanstack Forms](https://tanstack.com/form/latest/docs/overview)** forms

## VSCode Extensions

We recommend the following VSCode extensions for a better DX:

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
- [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=YoavBls.pretty-ts-errors)
- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **.NET SDK 10**
- **Node.js (>= 20)**
- **Angular CLI**
- **MySQL 8+**

---

## 🔧 Backend Setup (.NET 10)

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Restore dependencies:

   ```bash
   dotnet restore
   ```

3. Create `appsettings.Development.json` with your MySQL connection string:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=app_db;User=root;Password=your_password;"
   }
   ```

4. Run scaffold against MySQL to get updates:

   ```bash
       dotnet ef dbcontext scaffold \
       "Server=localhost;Port=3306;Database=databasename;User=username;Password=password;" \
       Pomelo.EntityFrameworkCore.MySql \
       --output-dir Models \
       --context CrmDbContext \
       --context-dir Data \
       --use-database-names \
       --no-onconfiguring;
   ```

5. Start the API:

   ```bash
   dotnet run
   ```

---

## 🗄️ Data Access

- Entity Framework Core is used as the ORM
- **LINQ** is used extensively for querying and projections
- DTOs are used to shape API responses
- Queries are optimized to avoid over-fetching

---

## 🎨 Frontend Setup (Angular)

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. To generate models and services from .NET:

   ```bash
   npm run generate:api
   ```

---

## 🧩 Frontend Architecture

### UI Components

- Built using **Spartan.ng**
- Fully styled with **Tailwind CSS**
- Responsive and accessible by default

### Data Fetching

- **TanStack Query** handles:

  - API calls
  - Caching
  - Loading & error states
  - Background refetching

### Tables

- **TanStack Table** is used for:

  - Sorting
  - Filtering
  - Pagination
  - Server-side or client-side data handling

---

## 🌐 API Integration

- Angular communicates with the backend via REST APIs
- Environment-based API configuration
- Strong typing using TypeScript interfaces

Example service pattern:

```ts
this.query = injectQuery(() => ({
  queryKey: ["users"],
  queryFn: () => this.http.get<User[]>(`${apiUrl}/users`),
}));
```
