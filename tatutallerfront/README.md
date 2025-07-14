# Tatutaller Frontend

## Overview
Tatutaller is a React-based application designed for managing a pottery workshop. It provides features for user and product administration, class management, and booking functionalities.

## Project Structure
The project is organized as follows:

```
tatutallerfront
├── public
│   └── index.html          # Main HTML file for the application
├── src
│   ├── App.jsx             # Main component that sets up routing and layout
│   ├── Features
│   │   ├── AdminPanel.jsx  # Component for managing users and products
│   │   └── ...             # Additional feature components
│   ├── components           # Reusable React components
│   ├── redux               # Redux actions, reducers, and store configuration
│   ├── api                 # API calls and backend interactions
│   ├── index.js            # Entry point for the React application
│   └── styles              # CSS and styling files
├── package.json            # npm configuration file
├── README.md               # Project documentation
└── .gitignore              # Files and directories to be ignored by Git
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd tatutallerfront
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To start the development server, run:
```
npm start
```
This will launch the application in your default web browser at `http://localhost:3000`.

### Building for Production
To create a production build, run:
```
npm run build
```
This will generate a `build` directory with optimized files for deployment.

## Usage
- The application allows administrators to manage users and products.
- Users can view classes and make bookings.
- The Admin Panel provides functionalities for adding, editing, and deleting users and products.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.