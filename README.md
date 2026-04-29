# BookStore

A web application for browsing and purchasing books online, with a separate admin panel for store management.

## Project Structure

```
bookstore-project/
├── frontend/
│   ├── client/       # Customer-facing pages
│   ├── admin/        # Admin panel pages
│   └── assets/       # Shared CSS and JavaScript
└── backend/          # Coming soon
```

## Features

### Customer
- Browse and search books by title or genre
- View book details
- Add books to cart and manage quantities
- Checkout and payment flow
- User authentication (login / register)
- Order history in profile

### Admin
- Dashboard overview
- Manage books (add, edit, delete)
- Manage customers
- Manage orders

## Tech Stack

**Frontend:** HTML, CSS, JavaScript (Vanilla)  
**Backend:** Java 21, AWS Lambda, AWS DynamoDB, AWS API Gateway, AWS Cognito *(in development)*

## Getting Started

### Prerequisites
- [VS Code](https://code.visualstudio.com/) with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension

### Run locally
1. Clone the repository:
   ```bash
   git clone https://github.com/akarlova/bookstore-project.git
   cd bookstore-project
   ```
2. Open the project folder in VS Code
3. Right-click `frontend/client/index.html` → **Open with Live Server**
4. For admin panel: open `frontend/admin/admin-login.html` the same way

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable releases |
| `develop` | Active development |
| `feature/*` | Individual features |

## Team

To be added.
