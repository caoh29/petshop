# 🐾 PetShop Ecommerce

A modern, full-stack ecommerce platform for pet supplies built with [Next.js 14](https://nextjs.org/), [Prisma](https://www.prisma.io/), and [Redux](https://redux.js.org/). Features include user authentication, shopping cart functionality, and secure payments via Stripe.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)

## ✨ Features

- 🛍️ Full ecommerce functionality
- 🔐 Authentication with NextAuth.js (including Google OAuth)
- 💳 Secure payment processing with Stripe
- 🛒 Shopping cart with Redux persistence
- 📱 Responsive design with Tailwind CSS
- 🎨 Modern UI components with Radix UI
- 🔍 Type-safe with TypeScript
- 🗃️ PostgreSQL database with Prisma ORM

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Stripe](https://stripe.com/) account
- [Google Cloud Console](https://console.cloud.google.com/) project (for OAuth)

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/petshop-ecommerce.git
cd petshop-ecommerce
```

2. Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/petshop?schema=public"

# Auth
AUTH_SECRET="your-auth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

3. Configure the database in `docker-compose.yaml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:latest
    environment:
      POSTGRES_USER: your_username
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: petshop
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Installation & Setup

1. Start the PostgreSQL database:

```bash
docker-compose up -d
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run Prisma migrations:

```bash
npx prisma migrate dev
```

4. Seed the database (optional):

```bash
npx prisma db seed
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application running! 🎉

## 🏗️ Project Structure

```
petshop/
├── .next/                    # Next.js build output
├── node_modules/             # Project dependencies
├── postgresql/               # Database container data
├── prisma/                   # Database schema and migrations
├── public/                   # Static assets and images
├── src/                      # Source code
│   ├── api/                  # API routes and handlers
│   ├── app/                  # Next.js app router components and pages
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions and shared logic
│   ├── mocks/                # Mock data and testing utilities
│   ├── store/                # Redux store configuration
│   ├── middleware.ts         # Next.js middleware configuration
│   └── auth.ts               # Authentication configuration
├── .env                      # Environment variables
├── docker-compose.yaml       # Docker configuration
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── README.md                 # Project documentation
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

### Key Directories Explained

- **`.next/`**: Contains the built production code
- **`prisma/`**: Houses the database schema, migrations, and seed data
- **`src/`**: Main source code directory
  - **`api/`**: Backend API routes and handlers
  - **`app/`**: Frontend pages and components using Next.js App Router
  - **`hooks/`**: Reusable React hooks
  - **`lib/`**: Shared utilities and helper functions
  - **`mocks/`**: Testing utilities and mock data
  - **`store/`**: Redux store setup, slices, and actions
  - **`auth.ts`**: Authentication configuration and providers
- **`middleware.ts`**: Request/response middleware functions

## 🔧 Technologies Used

- **Frontend**

  - Next.js 14
  - React
  - Redux Toolkit
  - Tailwind CSS
  - Radix UI Components
  - React Hook Form

- **Backend**
  - Next.js API Routes and Server Actions
  - Prisma ORM
  - PostgreSQL
  - Auth.js v5
  - Stripe API

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Production server
npm start

# Lint code
npm run lint
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Run migrations
npx prisma migrate dev
```

## 📝 License

This project is open source and free.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💖 Support

Give a ⭐️ if this project helped you!

## 📞 Contact

Camilo Ordonez Herrera - [@92iMAHC](https://x.com/92iMAHC) - cronox20@gmail.com

Project Link: [https://store.caoh29.dev](https://store.caoh29.dev)
