const express = require('express');
const router = express.Router();
const BloodRequest = require('../models/bloodRequest');
const authenticateToken = require('../middleware/auth');
const bloodRequest = require('../models/bloodRequest');

// POST /api/blood-request
router.post('/blood-request', authenticateToken, async (req, res) => {
  try {
    const { bloodGroup, urgency, location } = req.body;

    // You can get name from authenticated user
    const name = req.user.fullName;
    // Add today's date in preferred format
    const date = new Date().toISOString().split('T')[0]; // e.g., '2025-05-24'
    if (!bloodGroup || !urgency || !location) {
      return res.status(400).json({ message: 'bloodGroup, urgency, and location are required' });
    }

    const newRequest = new BloodRequest({
        bloodGroup,
        urgency,
        name,
        date,
        location,
        userId: req.user._id,  // here you link the request to the authenticated user
        status: 'Pending'      // default status
    });

    const savedRequest = await newRequest.save();

    res.status(201).json({
      message: 'Blood request created successfully',
      data: savedRequest
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating blood request' });
  }
});
// GET /api/request/mine
router.get('/mine', authenticateToken, async (req, res) => {
    try {
      const myRequests = await BloodRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
      res.json(myRequests);
      console.log('My Requests:', myRequests); // Debugging line
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch your requests' });
    }
});
// GET /api/request/match
router.get('/match', authenticateToken, async (req, res) => {
    try {
      const userBloodGroup = req.user.bloodGroup;
      if (!userBloodGroup) {
        return res.status(400).json({ message: 'User blood group not set in profile' });
      }
  
      const matchedRequests = await BloodRequest.find({
        bloodGroup: userBloodGroup,
        userId: { $ne: req.user._id }  // Exclude self
      }).sort({ createdAt: -1 });
  
      res.json(matchedRequests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch matching requests' });
    }
  });

  router.delete('/:id', authenticateToken, async (req, res) => {
    const requestId = req.params.id;
    const userId = req.user.id;
  
    try {
      const request = await bloodRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }
  
      if (request.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized to delete this request' });
      }
  
      await bloodRequest.findByIdAndDelete(requestId);
      res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
      console.error('Delete request error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
module.exports = router;
