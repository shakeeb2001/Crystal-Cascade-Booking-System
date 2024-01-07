# Crystal-Cascade-Booking-System

(https://github.com/shakeeb2001/Crystal-Cascade-Booking-System/blob/main/Frontend/front/src/images/logonew.png)

### About the application

The Crystal Cascade Hotel Accommodation Reservation and Management System was created to provide hassle-free services to both staff and customer. Signing up and logging in to the system allows users to do a range of tasks.

#### Customer

-	Customer Profile Form
-	View the Accommondation Types
-	Place a reservation

#### Admin

-	Manage Events and Dinings
-	Handling Booking History

---

### Dependencies

- NodeJS

- Express

- MongoDB

- Socket.io

- multer
---

### To run the application locally

#### How to run the server

Install dependencies
```
npm install
```

Run the server
```
node server.js
```

The application can be accessed using http://localhost:3000/ for customers and admin panel 


### How it works

#### Basics

The application is developed on a locally and distributed NodeJS and Express server. Routes are added for specific uses, incorporating database operations and terminating with a render method.


#### Using of Web Sockets

Web sockets have been used in this application to update other user interfaces instantaneously when an update has been done to the database. When the admin adds an upcoming event or dining, these data will be notified through a notification dropdown. Further, it has been utilized to update the Event page and Dining page, etc.













