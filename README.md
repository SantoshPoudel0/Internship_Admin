# Admin Panel for Training & Services Website

This is the admin panel for a training and services website built with React.

## Features

- User authentication and authorization
- Dashboard with overview statistics
- CRUD operations for services, trainings, reviews, and user messages
- User management
- Mobile responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Backend API running (see backend folder)

### Installation

1. Clone the repository
2. Navigate to the admin directory:
   ```
   cd admin
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables (optional):
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
   *Note: If not specified, it will default to http://localhost:5000*

### Running the Application

- Development mode:
  ```
  npm start
  ```
  The admin panel will be available at http://localhost:3000

- Production build:
  ```
  npm run build
  ```
  This creates an optimized production build in the `build` folder

## Usage

1. Login with admin credentials (default: admin@example.com / password123)
2. Navigate through the sidebar to manage different sections
3. Dashboard provides a quick overview of the website statistics
4. Each section allows you to view, create, update, and delete items

## Page Structure

- **Dashboard**: Overview statistics and recent activities
- **Services**: Manage service offerings
- **Trainings**: Manage training courses
- **Reviews**: Moderate customer reviews
- **Contacts**: Respond to user messages
- **Users**: Manage admin users

## Technologies Used

- React
- React Router
- React Bootstrap
- Axios for API requests
- FontAwesome icons 