const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const multer = require('multer');
const socketIO = require('socket.io');
const SignupModel = require('./models/signupmodel');
const EventModel = require('./models/eventcardmodel');
const DiningModel = require('./models//diningcardmodel');
const BookingModel = require('./models//bookinghistrotymodel');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
const URI = "mongodb+srv://shakeeb:226284@mycluster.hitx68p.mongodb.net/Cyrstal-Cascade?retryWrites=true&w=majority";
mongoose.connect(URI);
const connection = mongoose.connection;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const server = http.createServer(app);
const io = socketIO(server, { origins: "*" });

io.on('connection', (socket) => {

  socket.on('new-event', (event) => {
    io.emit('new-event-notification', event);
  });

  socket.on('new-dining', (dining) => {
    io.emit('new-dining-notification', dining);
  });
});


app.post('/signup', async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await SignupModel.findOne({ username });

    if (existingUser) {
      res.status(409).json({ error: 'Username already exist.' });
    } else {
      const newUser = await SignupModel.create({
        username,
        firstName,
        lastName,
        email,
        password,
      });

      res.status(201).json({ message: 'User added successfully', user: newUser });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/signup/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await SignupModel.findOne({ username });
  
      if (user) {
        res.json({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          password: user.password, // Note: It's not recommended to send the password to the client
        });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'internal Server Error' });
    }
  });
  
  app.put('/api/signup/:username', async (req, res) => {
    const { username } = req.params;
    const updatedUserData = req.body;
  
    try {
      const updatedUser = await SignupModel.findOneAndUpdate(
        { username },
        { $set: updatedUserData },
        { new: true }
      );
  
      if (updatedUser) {
        console.log('User profile updated:', updatedUser);
        res.json(updatedUser);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.delete('/api/signup/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      const deletedUser = await SignupModel.findOneAndDelete({ username });
  
      if (deletedUser) {
        console.log('User profile deleted:', deletedUser);
        res.json({ message: 'User profile deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  app.post('/login', (req, res) => {
    const { username, password } = req.body;

    SignupModel.findOne({ username })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json('success');
                } else {
                    res.json('Incorrect Username or Password');
                }
            } else {
                if (!user) {
                    res.json('User not found');
                } else {
                    res.json('Incorrect Username or Password');
                }
            }
        })
        .catch(err => res.json(err));
});


app.post('/api/events', upload.single('image'), async (req, res) => {
    EventModel.create({
      title: req.body.title,
      description: req.body.description,
      image: req.file.buffer.toString('base64'),
    })
    .then(newEvent => {
      // Emit a new event notification to connected clients
      io.emit('new-event-notification', { title: newEvent.title });
      console.log('Created new event:', newEvent);
      res.json(newEvent);
    })
    .catch(err => {
      console.error('Error creating event:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });

  app.post('/api/dinings', upload.single('image'), (req, res) => {
    DiningModel.create({
        title: req.body.title,
        description: req.body.description,
        image: req.file.buffer.toString('base64'),
    })
    .then(newDining => {
        // Emit a new dining notification to connected clients
        io.emit('new-dining-notification', { title: newDining.title });
        console.log('Created new dining card:', newDining);
        res.json(newDining);
    })
    .catch(err => {
        console.error('Error creating dining card:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/api/events', async (req, res) => {
    try {
      const existingCards = await EventModel.find();
      res.json(existingCards);
    } catch (error) {
      console.error('Error fetching existing cards:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/api/dinings', async (req, res) => {
    try {
      const existingCards = await DiningModel.find();
      res.json(existingCards);
    } catch (error) {
      console.error('Error fetching existing cards:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/api/events/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
      const deletedEvent = await EventModel.findByIdAndDelete(eventId);
      if (deletedEvent) {
          // Emit a delete event notification to connected clients
          io.emit('delete-event-notification', { eventId });
          res.json({ message: 'Event card deleted successfully' });
      } else {
          res.status(404).json({ error: 'Event card not found' });
      }
  } catch (error) {
      console.error('Error deleting event card:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/dinings/:diningId', async (req, res) => {
  const { diningId } = req.params;

  try {
      const deletedDining = await DiningModel.findByIdAndDelete(diningId);
      if (deletedDining) {
          // Emit a delete dining notification to connected clients
          io.emit('delete-dining-notification', { diningId });
          res.json({ message: 'Dining card deleted successfully' });
      } else {
          res.status(404).json({ error: 'Dining card not found' });
      }
  } catch (error) {
      console.error('Error deleting Dining card:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/reservations', (req, res) => {
    const {
        name,
        idNumber,
        phoneNumber,
        roomType,
        checkIn,
        checkOut
    } = req.body;

    BookingModel.create({
        name,
        idNumber,
        phoneNumber,
        roomType,
        checkIn,
        checkOut,
    })
    .then(newReservation => {
        console.log('Reservation created:', newReservation);
        res.json({message: 'Reservation created successfully',newReservation});
    })
    .catch(err => {
        console.error('Error creating reservation:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.get('/api/reservations', async (req, res) => {
    try {
      const existingReservations = await BookingModel.find();
      res.json(existingReservations);
    } catch (error) {
      console.error('Error fetching existing reservations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Update reservation by ID
app.put('/api/reservations/:reservationId', async (req, res) => {
    const { reservationId } = req.params;
    const {
        name,
        idNumber,
        phoneNumber,
        roomType,
        checkIn,
        checkOut
    } = req.body;

    try {
        const updatedReservation = await BookingModel.findByIdAndUpdate(
            reservationId,
            {
                name,
                idNumber,
                phoneNumber,
                roomType,
                checkIn,
                checkOut,
            },
            { new: true }
        );

        if (updatedReservation) {
            console.log('Reservation updated:', updatedReservation);
            res.json({message: 'Reservation Updated',updatedReservation});
        } else {
            res.status(404).json({ error: 'Reservation not found' });
        }
    } catch (error) {
        console.error('Error updating reservation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete reservation by ID
app.delete('/api/reservations/:reservationId', async (req, res) => {
    const { reservationId } = req.params;

    try {
        const deletedReservation = await BookingModel.findByIdAndDelete(reservationId);
        if (deletedReservation) {
            console.log('Reservation deleted successfully');
            res.json({ message: 'Reservation deleted successfully' });
        } else {
            res.status(404).json({ error: 'Reservation not found' });
        }
    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Find booking by ID number
app.get('/api/reservations/:idNumber', async (req, res) => {
  const { idNumber } = req.params;

  try {
      const bookings = await BookingModel.find({ idNumber });

      if (bookings.length === 0) {
          res.status(404).json({ message: 'No records available for the provided ID number' });
      } else {
          res.json(bookings);
      }
  } catch (error) {
      console.error('Error finding reservations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
