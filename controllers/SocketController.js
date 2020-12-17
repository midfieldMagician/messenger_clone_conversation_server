const MessageModel = require('../models/Message').model
const UserModel = require('../models/User').model
const ConversationModel = require('../models/Conversation')

let handleSocket = (socket) => {
    const {accessToken} = socket.handshake.query
    // Get userId from accessToken
    const userId = ''
    socket.join(userId)

    
    // // Get the last 10 messages from the database.
    // MessageModel.find().sort({createdAt: -1}).limit(10).exec((err, messages) => {
    //   if (err) return console.error(err);

    //   // Send those messages to the user.
    //   socket.emit('init', messages);
    // });

    // Listen to connected users for a new message.
    socket.on('send-message', ({conversationId, message}) => {
      // Create a message with the message and id of the user.
      const message = new MessageModel({
        message,
        userId,
      })

      // Save the message to the database.
      const conversation = ConversationModel.findById(conversationId, (err, conversation) => {
          if(err) return console.error(err)
          conversation.messages.push(message)
          conversation.save((err) => {
            if (err) return console.error(err);
          })
      })


      // Notify all other users, including the sender, about the new message.
      let allRecipientIds = conversation.users
      allRecipientIds.forEach(recipientId => {
        socket.broadcast.to(recipientId).emit('push-message', message);
      })
    });
}

module.exports = {
    handleSocket
}