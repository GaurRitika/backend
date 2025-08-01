import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.token = token;
    this.socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Send message
  sendMessage(data: {
    receiverId: string;
    content: string;
    messageType?: string;
    attachments?: any[];
  }) {
    if (this.socket?.connected) {
      this.socket.emit('send_message', data);
    }
  }

  // Typing indicators
  startTyping(receiverId: string) {
    if (this.socket?.connected) {
      this.socket.emit('typing_start', { receiverId });
    }
  }

  stopTyping(receiverId: string) {
    if (this.socket?.connected) {
      this.socket.emit('typing_stop', { receiverId });
    }
  }

  // Listen for new messages
  onReceiveMessage(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  // Listen for typing indicators
  onUserTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserStopTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_stop_typing', callback);
    }
  }

  // Remove listeners
  offReceiveMessage() {
    if (this.socket) {
      this.socket.off('receive_message');
    }
  }

  offUserTyping() {
    if (this.socket) {
      this.socket.off('user_typing');
    }
  }

  offUserStopTyping() {
    if (this.socket) {
      this.socket.off('user_stop_typing');
    }
  }
}

export const socketManager = new SocketManager();