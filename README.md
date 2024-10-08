# HurricaneGIS

## Overview
**HurricaneGIS** is a web-based application designed to help communities report and visualize incidents after natural disasters. This platform provides users with an interactive map interface to report hazards such as flooding, broken powerlines, and debris, allowing for real-time updates. It also supports uploading pictures along with descriptions to provide more context and details for each report.

## Key Features
- **Google Maps Integration**: Provides an interactive map interface that allows users to view and drop pins at specific locations affected by natural disasters.
- **Real-Time Incident Reporting**: Users can report incidents like floods, debris, broken powerlines, or vehicle crashes by dropping pins on the map.
- **MongoDB Data Storage**: Incident data, including geographical coordinates, issue types, descriptions, and optionally images, are stored in a MongoDB database for persistence.
- **Responsive Design**: The app features a simple and user-friendly interface, making it easy to report and visualize incidents.

## How It Works
1. **Map Interaction**: Upon loading, the application uses the Google Maps API to display a map centered on the user’s current location (if geolocation is allowed). Users can view existing reported incidents marked by pins.
2. **Reporting a New Incident**: Users click on any location on the map to report an issue. This action triggers a modal form where they can specify the type of issue (e.g., flood, debris) and provide a description. They can also optionally upload a photo to better illustrate the situation.
3. **Pin Submission**: Once the form is submitted, the app sends the data (including the image if uploaded) to the backend, where it is stored in MongoDB. The new pin is then immediately added to the map, allowing users to see the new report in real-time.
4. **Viewing Incidents**: Users can click on any pin on the map to view the details of the reported issue, including its type and description, in an info window that appears over the map.

## Technologies Used

### Frontend:
- HTML, CSS, and JavaScript
- **Google Maps JavaScript API**: for the interactive map and geolocation.
- **Fetch API**: for sending and receiving data to/from the server.

### Backend:
- **Node.js and Express**: Server-side framework handling routes and data processing.
- **MongoDB and Mongoose**: Database for storing pin information (e.g., coordinates, descriptions, issue types).
- **Multer**: Middleware for handling file uploads (images).

## Setup Instructions
1. Clone the repository.
2. Install the required dependencies using `npm install`.
3. Set up a MongoDB database. You can use MongoDB Atlas for cloud storage.
4. Run the server using `node server.js` or `nodemon` if installed.
5. Open the app in the browser at `http://localhost:3000/`.

## Challenges Faced and How We Overcame Them

### Real-Time Map Updates
- **Challenge**: One of the main challenges was ensuring that new pins (representing reports) appeared on the map immediately after submission without requiring a page refresh.
- **Solution**: We dynamically added markers to the map right after a successful pin submission using JavaScript. This real-time update mechanism was made possible by handling the response from the backend and adding the pin to the map on the frontend.

### Ensuring Data Persistence and Accuracy
- **Challenge**: Maintaining the accuracy of incident data, such as ensuring valid coordinates and properly handling user input (e.g., preventing empty submissions), was crucial.
- **Solution**: We implemented proper validation both on the frontend (using form validation) and the backend (with schema validation via Mongoose) to ensure that only valid reports were submitted and stored.

### User Experience
- **Challenge**: Creating a user-friendly interface with a smooth flow of actions, such as toggling the "About" panel and opening/closing modals without interfering with the map.
- **Solution**: We used JavaScript event listeners and animations to create a smooth experience. The transitions and modal opening/closing mechanisms were fine-tuned to provide a responsive, engaging interface.

## Future Improvements
- **Additional Reporting Options**: Expanding the range of issue types and allowing users to add more details like severity or expected resolution time.
- **Mobile Optimization**: Further enhancing mobile support to allow for seamless interaction across all device types.

## License
This project is licensed under the MIT License.
