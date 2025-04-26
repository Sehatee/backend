# Healthcare Management API

A comprehensive healthcare management system API built with NestJS, providing features for medical records, appointments, and user management.

## Features

- **User Management**
  - Authentication (Login/Signup)
  - Role-based access control (Admin, Doctor, Patient)
  - Profile management
  - Password reset functionality

- **Medical Records**
  - Create and manage medical records
  - File attachments support (images, PDFs, Word documents)
  - Secure access control
  - Record history tracking

- **Appointments**
  - Schedule and manage appointments
  - Status tracking (pending, confirmed, cancelled)
  - Doctor-patient matching
  - Appointment history

- **Notifications**
  - Real-time notifications
  - Doctor-specific notifications
  - Notification management

## Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Real-time**: WebSocket

## API Routes

### Authentication (`/api/v1/auth`)
- `POST /login` - User login
- `POST /signup` - User registration
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset
- `GET /me` - Get current user profile
- `PATCH /me` - Update profile
- `DELETE /me` - Delete account

### Users (`/api/v1/users`)
- `GET /` - Get all users (admin)
- `POST /create` - Create user (admin)
- `GET /:id` - Get user by ID
- `PATCH /:id` - Update user (admin)
- `DELETE /:id` - Delete user (admin)

### Medical Records (`/api/v1/medicalRecords`)
- `GET /` - Get all records (admin)
- `POST /` - Create record (doctor)
- `GET /:id` - Get records by doctor
- `PATCH /:id` - Update record (doctor)
- `DELETE /:id` - Delete record (doctor)

### Appointments (`/api/v1/appointments`)
- `POST /` - Create appointment (patient)
- `GET /:id` - Get appointment (doctor)
- `GET /` - Get all appointments (doctor)
- `PATCH /:id` - Update appointment (doctor)
- `DELETE /:id` - Delete appointment (doctor)

### Notifications (`/api/v1/notifications`)
- `GET /` - Get notifications (doctor)
- `DELETE /` - Delete notifications (doctor)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd hagiz_api
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Run the application
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

## Development

### Available Scripts
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier

## Security Features

- JWT-based authentication
- Role-based access control
- Password hashing
- File upload validation
- Input validation using DTOs
- Secure file storage

## License

This project is licensed under the MIT License - see the LICENSE file for details.
