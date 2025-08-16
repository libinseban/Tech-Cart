const ChatMessage = require('../models/chat/message');
const { uploadToS3 } = require('../middleware/chat');

exports.sendMessage = async (req, res) => {
  const sender = req.cookies.userId; 
  const { receiver, message } = req.body;

  try {
    let fileUrl = null;
    if (req.file) {
      const urls = await uploadToS3([req.file]);
      fileUrl = urls[0];
    }

    const newMessage = new ChatMessage({
      sender,
      receiver,
      message,
      image: req.file?.mimetype.startsWith('image/') ? fileUrl : undefined,
      audio: req.file?.mimetype.startsWith('audio/') ? fileUrl : undefined,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const userId = req.cookies.userId; 

    const messages = await ChatMessage.find({
      $or: [
        { sender: userId, receiver: receiverId ,senderDeleted: false},
        { sender: receiverId, receiver: userId ,receiverDeleted: false},
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.seenMessage = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    const { messageId } = req.params;

    const message = await ChatMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only the receiver can mark as seen
    if (message.receiver.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    message.seen = true; // or however you track seen status
    await message.save();

    res.status(200).json({ message: 'Message marked as seen' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteMessage = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    const { receiverId, messageId } = req.body;

    const message = await ChatMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is sender or receiver of this message
    if (userId !== message.sender && userId !== message.receiver) {
      return res.status(403).json({ message: 'Unauthorized to delete this message' });
    }

   // Soft delete for sender
    if (userId === message.sender) {
      message.senderDeleted = true;
    }

    // Soft delete for receiver
    if (userId === message.receiver) {
      message.receiverDeleted = true;
    }

    // If both deleted, remove message permanently
    if (message.senderDeleted && message.receiverDeleted) {
      await ChatMessage.findByIdAndDelete(messageId);
      
      return res.status(200).json({ message: 'Message deleted permanently' })}
      else {
      await message.save();
      return res.status(200).json({ message: 'Message deleted for you' });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: 'Error deleting message' });
  }
};

module.exports = exports;
