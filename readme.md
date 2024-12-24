# AdoptMe - Pet Adoption Platform

## Description
AdoptMe is a web application built with Node.js and Express that facilitates pet adoption processes. The platform allows users to manage pets, users, and adoption operations through a RESTful API.

## Features
- User management (CRUD operations)
- Pet management (CRUD operations)
- Adoption process handling
- File uploads for pet images
- Mock data generation for testing
- Error handling middleware
- MongoDB integration
- Docker support

## Tech Stack
- Node.js
- Express
- MongoDB (Mongoose)
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Faker.js for mock data
- Cookie Parser
- dotenv for environment variables
- Docker

## Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Create .env file with required variables:
MONGO_URL=your_mongodb_url
PORT=8080

# Run the application
npm run dev   # Development mode
npm start     # Production mode
```

## Docker
To run the application using Docker, follow these steps:

```bash
# Build the Docker image
docker build -t franadoptme .

# Run the Docker container
docker run -p 8080:8080 franadoptme
```

You can also pull the Docker image from Docker Hub:

```bash
docker pull francososa1/franadoptme
```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:uid` - Get user by ID
- `PUT /api/users/:uid` - Update user
- `DELETE /api/users/:uid` - Delete user

### Pets
- `GET /api/pets` - Get all pets
- `POST /api/pets` - Create new pet
- `POST /api/pets/withimage` - Create pet with image
- `PUT /api/pets/:pid` - Update pet
- `DELETE /api/pets/:pid` - Delete pet

### Adoptions
- `GET /api/adoptions` - Get all adoptions
- `GET /api/adoptions/:aid` - Get adoption by ID
- `POST /api/adoptions/:uid/:pid` - Create new adoption

## Testing
```bash
npm run test
```

## Project Structure
```
src/
├── controllers/    # Request handlers
├── dao/           # Data Access Objects
├── dto/           # Data Transfer Objects
├── middleware/    # Express middleware
├── models/        # Database models
├── repository/    # Repository pattern implementation
├── routes/        # API routes
├── services/      # Business logic
└── utils/         # Utility functions
```

## Error Handling
The application implements a custom error handling system with:
- Custom error classes
- Error enumerations
- Detailed error information generation
- Middleware error handler

## Docker Hub
- [Repository URL](https://hub.docker.com/r/francososa1/franadoptme)
- [Profile URL](https://hub.docker.com/u/francososa1)

## Contributors
[List of contributors]

## License
ISC