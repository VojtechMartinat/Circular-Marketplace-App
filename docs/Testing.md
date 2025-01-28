# Testing Guidelines Before Submitting a Pull Request

Follow these steps to ensure your changes are properly tested before submitting a pull request:

## If the **frontend** folder was modified:
1. **Run Frontend Tests:**
    - Navigate to the `frontend` directory.
    - Run the following command:
      ```bash
      npm test
      ```
    - Ensure all tests pass.

2. **Start the Frontend Server:**
    - Start the development server by running:
      ```bash
      npm start
      ```
    - Open the application in your browser and verify that the modified features render correctly.

## If the **backend** folder was modified:
1. **Run Backend Tests:**
    - Navigate to the `backend` directory.
    - Run the following command:
      ```bash
      npm test
      ```
    - Ensure all tests pass.

2. **Start the Backend Server:**
    - Verify that your `.env` file is correctly configured with all necessary variables. It must include:
      ```bash
      export DB_USER="database_username"
      export DB_PASS="database_password"
      ```
    - Start the backend server by running:
      ```bash
      npm start
      ```
    - Test the modified backend functionality using tools like Postman or through the integrated frontend.
   

## Final Checklist:
- Ensure no test failures remain in either `frontend` or `backend`.
- Verify that changes do not break existing functionality.
- Test on your local environment before creating the pull request.
