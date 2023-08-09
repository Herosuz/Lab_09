const express = require('express');
const router = express.Router();
const model = require('./Model');

// POST request to create a new event
router.post('/', async (req, res, next) => {
  try {
    const { temperature, humid, time } = req.body;
    const event = new model({
      temperature,
      humid,
      time,
    });
    await event.save();
    return res.status(200).json({ message: 'Event created successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET request to retrieve events
router.get('/', async (req, res, next) => {
  try {
    const events = await model.find();
    res.json(events);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST request to update an event
router.post('/update', async (req, res) => {
  try {
    const { id, temperature, humid, time } = req.body;
    const event = await model.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedEvent = await model.findByIdAndUpdate(
      id,
      { temperature, humid, time },
      { new: true }
    );

    return res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST request to delete an event
router.post('/delete', async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await model.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await model.findByIdAndDelete(eventId);

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET request to list all events
router.get('/list', async (req, res) => {
  try {
    const events = await model.find();
    res.json(events);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;