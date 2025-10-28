# Sanitary E-commerce Platform

A full-stack e-commerce platform for sanitary products built with React, TypeScript, Node.js, and MySQL.

## Features

- 🛒 Complete e-commerce functionality with product catalog, cart, and checkout
- 🌐 Multilingual support (French and Arabic)
- 🔐 User authentication with JWT
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS
- 🔍 Product search and filtering
- 🛠️ Admin dashboard (coming soon)

## Technology Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- React Query for data fetching
- Zustand for state management
- i18next for internationalization

### Backend
- Node.js with Express
- MySQL database
- JWT for authentication
- REST API

## Setup Instructions

### Prerequisites
- Node.js (v16+) or Bun
- MySQL (optional - the app has a fallback to local storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ibrahimsohofi/sanitary-ecommerce.git
cd sanitary-ecommerce
```

2. Install dependencies:
```bash
# Using npm
npm install
cd backend
npm install
cd ..

# Using Bun (recommended)
bun install
cd backend
bun install
cd ..
```

3. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Update the database connection details and JWT secret

4. Setup the database (optional):
```bash
# Initialize the database with sample data
bun run backend:init
```

5. Download product images:
```bash
bun run backend:images
```

### Running the Application

Start both frontend and backend concurrently:
```bash
bun run start
```

Or run them separately:
```bash
# Frontend only
bun run dev

# Backend only
bun run backend
```

The frontend will be available at http://localhost:5173 and the backend API at http://localhost:5000.

## Database Setup (Optional)

If you want to use a MySQL database instead of the local fallback:

1. Create a new MySQL database:
```sql
CREATE DATABASE sanitary_ecommerce;
```

2. Import the schema:
```bash
mysql -u your_username -p sanitary_ecommerce < backend/database/schema.sql
```

3. Import sample product data:
```bash
mysql -u your_username -p sanitary_ecommerce < backend/database/roca-products.sql
```

4. Update the database configuration in `backend/.env`

## Folder Structure

```
sanitary-ecommerce/
├── backend/              # Backend Node.js server
│   ├── config/           # Server configuration
│   ├── database/         # Database schema and setup
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── uploads/          # Uploaded files storage
│   └── server.js         # Main server file
├── public/               # Static files
├── src/                  # Frontend React code
│   ├── components/       # Reusable components
│   ├── data/             # Local data (fallback)
│   ├── lib/              # Utilities and stores
│   ├── locales/          # Translation files
│   ├── pages/            # Page components
│   └── App.tsx           # Main app component
└── package.json          # Project dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `GET /api/products?featured=true` - Get featured products
- `GET /api/products?category=:id` - Get products by category

### Categories
- `GET /api/categories` - Get all categories

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get a single order

## Deployment

### Frontend Deployment
The frontend can be built for production with:
```bash
bun run build
```

This will generate optimized files in the `dist` directory that can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

### Backend Deployment
The backend can be deployed to any Node.js hosting service such as:
- Heroku
- Digital Ocean
- AWS Elastic Beanstalk

Make sure to set all environment variables on your hosting provider.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Product images from [Roca](https://www.roca.com/)
- Icons from [Lucide Icons](https://lucide.dev/)
- UI inspiration from various e-commerce platforms
# ecom
