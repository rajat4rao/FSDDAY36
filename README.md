# Password Reset Flow 

This application allows registration of user, login, forget password and change password.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project URL

- **Live URL**: Click [here](https://password-reset-fsdday37.onrender.com/).
- **Backend URL** Click [here](https://fsdday36-backend.onrender.com/).
  
## Technologies:

- **Frontend**: React.js, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Email Service**: Nodemailer


---


## API Endpoints

- **Register**: `POST /api/register`

  - **Request Body**:
    ```json
    {
      "username": "yourUsername",
      "email": "yourEmail",
      "password": "yourPassword"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "User registered successfully"
    }
    ```

- **Login**: `POST /api/login`

  - **Request Body**:
    ```json
    {
      "email": "yourEmail",
      "password": "yourPassword"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Login successful",
      "token": "yourJWTToken"
    }
    ```

- **Forgot Password**: `POST /api/forgot-password`

  - **Request Body**:
    ```json
    {
      "email": "yourEmail"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Password reset link sent to email"
    }
    ```

- **Reset Password**: `PUT /api/reset-password/:token`
  - **Request Body**:
    ```json
    {
      "password": "yourNewPassword"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Password has been reset successfully"
    }
    ```

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/rajat4rao/password-reset.git
```

2. Navigate to the project directory:

```bash
cd password-reset
```

3. Install the dependencies for frontend:

```bash
npm install
```

4. Install the dependencies for backend:

```bash
cd backend
npm install
```

---

## Usage

1. Start the development server:

- frontend:

```bash
npm start
```

- backend:

```bash
cd backendend
npm run dev
