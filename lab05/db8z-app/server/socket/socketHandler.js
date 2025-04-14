import Message from '../models/Message.js';
import Debate from '../models/Debate.js';
import User from '../models/User.js';

export const handleSocketConnection = (io, socket) => {
  console.log('🔌 New client connected:', socket.id);
  console.log('Auth data:', socket.auth);

  // Join a debate room
  socket.on('join-debate', async (debateId) => {
    try {
      console.log(`Attempting to join debate ${debateId}`);
      console.log('Socket ID:', socket.id);
      console.log('User auth:', socket.auth);
      
      // Verify the debate exists
      const debate = await Debate.findById(debateId);
      if (!debate) {
        console.log(`Debate not found: ${debateId}`);
        socket.emit('error', { message: 'Debate not found' });
        return;
      }

      socket.join(debateId);
      console.log(`🟢 Client ${socket.id} joined debate ${debateId}`);

      // Update debate participants if user is authenticated
      if (socket.auth?.userId) {
        console.log(`Adding user ${socket.auth.userId} to debate participants`);
        
        try {
          // Create participant object with required structure
          const participantData = {
            user: socket.auth.userId,
            role: 'participant',
            joinedAt: new Date()
          };

          await Debate.findByIdAndUpdate(debateId, {
            $addToSet: { participants: participantData }
          });
          
          // Notify others about new participant
          const user = await User.findById(socket.auth.userId);
          console.log('Found user:', user ? user.name : 'User not found');
          
          if (user) {
            io.to(debateId).emit('participant-joined', {
              userId: user._id,
              name: user.name,
              avatar: user.avatar,
              role: 'participant'
            });
          } else {
            console.log(`User not found for ID: ${socket.auth.userId}`);
          }
        } catch (dbError) {
          console.error('Database error while updating participants:', dbError);
          socket.emit('error', { message: 'Failed to update debate participants' });
        }
      } else {
        console.log('User not authenticated for join-debate');
        socket.emit('error', { message: 'Authentication required to join debate' });
      }
    } catch (error) {
      console.error('Error joining debate:', error);
      console.error('Error details:', {
        debateId,
        socketId: socket.id,
        auth: socket.auth,
        errorMessage: error.message
      });
      socket.emit('error', { message: 'Failed to join debate' });
    }
  });

  // Leave a debate room
  socket.on('leave-debate', async (debateId) => {
    try {
      console.log(`Attempting to leave debate ${debateId}`);
      socket.leave(debateId);
      console.log(`🔴 Client ${socket.id} left debate ${debateId}`);

      // Update debate participants if user is authenticated
      if (socket.auth?.userId) {
        console.log(`Removing user ${socket.auth.userId} from debate participants`);
        
        await Debate.findByIdAndUpdate(debateId, {
          $pull: { participants: { user: socket.auth.userId } }
        });

        // Notify others about participant leaving
        io.to(debateId).emit('participant-left', socket.auth.userId);
      }
    } catch (error) {
      console.error('Error leaving debate:', error);
      socket.emit('error', { message: 'Failed to leave debate' });
    }
  });

  // Handle new message
  socket.on('send-message', async (data) => {
    try {
      console.log('Received message data:', data);
      const { debateId, content } = data;
      
      if (!socket.auth?.userId) {
        console.log('Message rejected: User not authenticated');
        socket.emit('error', { message: 'Authentication required' });
        return;
      }

      console.log(`Creating message for debate ${debateId} from user ${socket.auth.userId}`);
      
      // Create and save the message
      const message = new Message({
        debateId,
        userId: socket.auth.userId,
        content
      });
      
      await message.save();
      console.log('Message saved:', message._id);

      // Populate user details
      await message.populate('userId', 'name avatar');
      console.log('Message populated with user details');

      // Broadcast the message to all clients in the debate
      io.to(debateId).emit('new-message', message);
      console.log('Message broadcast to room');
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing status
  socket.on('typing-start', (debateId) => {
    if (socket.auth?.userId) {
      socket.to(debateId).emit('user-typing', socket.auth.userId);
    }
  });

  socket.on('typing-stop', (debateId) => {
    if (socket.auth?.userId) {
      socket.to(debateId).emit('user-stopped-typing', socket.auth.userId);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
}; 