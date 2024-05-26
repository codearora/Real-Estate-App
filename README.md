# Real Estate Web Application

This is a full-stack web application for managing real estate properties. Sellers can register, add, update, and delete their properties, while buyers can view property details and express interest.

## Technologies Used

- **Frontend:** React
- **Backend:** Node.js, Express
- **Database:** SQLite
- **HTTP Client:** Axios

## Features

### Seller
- Register and login
- Add, update, and delete properties
- View list of their properties

### Buyer
- Register and login
- View property details

## Setup and Installation

### Prerequisites
- Node.js and npm installed
- SQLite installed

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/real-estate-app.git
   cd real-estate-app
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   node server.js
   ```

2. Start the frontend server:
   ```bash
   cd ../frontend
   npm start
   ```

### Database Setup

The SQLite database will be created automatically with the necessary tables when the backend server is started for the first time.

## Project Structure

### Backend (`backend` folder)
- `server.js`: Entry point of the backend application.
- `database.db`: SQLite database file.
- `routes`: Contains route handlers for user and property endpoints.

### Frontend (`frontend` folder)
- `src/components`: React components (SellerDashboard, PropertyDetails, etc.).
- `src/App.js`: Main app component.

## API Endpoints

### User Endpoints
- **POST** `/users/register`: Register a new user.
- **POST** `/users/login`: Login a user.

### Property Endpoints
- **GET** `/properties`: Get all properties.
- **GET** `/properties/seller/:sellerId`: Get properties for a specific seller.
- **GET** `/properties/:id`: Get details of a specific property.
- **POST** `/properties`: Add a new property.
- **PUT** `/properties/:id`: Update a property.
- **DELETE** `/properties/:id`: Delete a property.

## Usage

### Register as a Seller

1. Navigate to the registration page.
2. Fill in the registration form and select "Seller" as the role.
3. Submit the form to register.

### Add a Property

1. Log in as a seller.
2. Navigate to the "My Properties" page.
3. Fill in the form to add a new property.
4. Submit the form to add the property.

### Update a Property

1. Log in as a seller.
2. Navigate to the "My Properties" page.
3. Click the "Update" button next to the property you want to update.
4. Update the property details in the form.
5. Submit the form to save the changes.

### Delete a Property

1. Log in as a seller.
2. Navigate to the "My Properties" page.
3. Click the "Delete" button next to the property you want to delete.

### View Property Details as a Buyer

1. Navigate to the home page.
2. Click on a property to view its details.
3. Click the "I am interested" button to see seller contact information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Contact

For any questions or feedback, please contact [jaiarora6377@gmail.com].

---

