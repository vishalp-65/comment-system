
# Comment System with Infinite Scrolling

This project is a comment system with infinite scrolling functionality, built using React and Firebase. Users can post comments, view them in a sorted manner, and see more comments load as they scroll.

## Setup and Installation

### Prerequisites

- Node.js (v14 or later)
- Firebase account and project

### Cloning the Repository

1. Clone the repository:

   ```bash
   git clone https://github.com/vishalp-65/comment-system.git
   ```

2. Navigate into the project directory:

   ```bash
   cd comment_system
   ```

### Install Dependencies

3. Install the required dependencies:

   ```bash
   npm install
   ```

### Firebase Setup

4. Set up Firebase:

   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project or use an existing one.
   - Go to the **Project settings** and find your Firebase config. You will need the following information:

     - API Key
     - Auth Domain
     - Project ID
     - Messaging Sender ID
     - App ID
     - Measurement ID

### Environment Variables

5. Create a `.env.local` file in the root directory of the project and add your Firebase configuration details:

   ```plaintext
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
   ```

### Running the Development Server

6. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

### Building for Production

7. Build the project for production:

   ```bash
   npm run build
   ```

   This command generates a `.next` folder containing the optimized build.

8. Start the production server:

   ```bash
   npm start
   ```

### API Endpoints

- **GET /api/comment?sortBy=<sortBy>&page=<page>&pageSize=<pageSize>**: Fetches comments with pagination and sorting.
- **POST /api/comment**: Creates a new comment.
- **POST /api/comment/commentId/reactions**: Reaction for a particular comment
- - **POST /api/comment/commentId/reply**: Reply to a particular comment a particular comment

### Additional Information

- **Firebase Configuration**: Ensure that your Firebase rules allow read and write access as needed for the application.
- **Error Handling**: Error handling is implemented for API calls and Firebase interactions.

Feel free to open an issue or submit a pull request if you encounter any problems or have suggestions for improvements.

