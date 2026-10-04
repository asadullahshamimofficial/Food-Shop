# **Food Shop**

The purpose of the Food Shop Application is to provide a platform for food enthusiasts to browse and purchase food items while offering sellers the ability to add and manage their food listings. It supports robust user authentication, role-based access control, and real-time food inventory management.


## **Live URL**
The application is live at: https://food-shop-aus.web.app


## **Key Features**

1. Public Features
  - View all food items with pagination.
  - Food details page with description and price.

2. User Features
  - Register and log in using email/password.
  - Add food items (with an image, description, and price).
  - View and manage their own food items in the "My Foods" section.
  - Purchase food items with quantity management.

3. Admin Features
  - Manage all food listings (add, edit, delete).
  - View the purchase history for all users.

4. Authentication & Authorization
  - Secure login using JWT authentication.
  - Protected routes for users and admins.
  - Role-based access to restrict admin-only and user-only features.


5. Miscellaneous
  - Dynamic routing for food details.
  - Fully responsive UI built with Tailwind CSS.
  - Real-time integration with MongoDB for data storage.


## **Used npm Packages**

1. Frontend (React-based):
  - React Router DOM:
  - Tailwind CSS
  - Axios
  - Firebase
  - lottie-react
  - react-icons
  - sweetalert2


2. Backend (Node.js-based)
  - Express.js
  - Cors
  - dotenv
  - MongoDB
  - jsonwebtoken
  - cookie-parser