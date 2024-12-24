import { Injectable } from '@nestjs/common';
import { SocketDbService } from './socket.db.service';

interface Client {
  roomId: string | null;
  userName: string;
}

interface Message {
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}
@Injectable()
export class SocketService {
  private activeClients: Map<string, Client> = new Map();
  private messages: Record<string, Message[]> = {};
  public rooms: Map<string, boolean> = new Map(); // Track if room is occupied
  constructor(private readonly socketDbService: SocketDbService) {}  // Inject SocketDbService

  // Add a new client
  addClient(clientId: string, roomId: string) {
    this.activeClients.set(clientId, { roomId, userName: 'anonymous' });
    this.rooms.set(roomId, true); // Mark the room as occupied
  }

  // Remove a client
  removeClient(clientId: string) {
    const client = this.activeClients.get(clientId);
    if (client?.roomId) {
      this.leaveRoom(clientId, client.roomId);
    }
    this.activeClients.delete(clientId);
  }

  // Join a room
  joinRoom(clientId: string, roomId: string, userName: string) {
    if (this.rooms.get(roomId)) {
      // If room is already occupied, reject joining
      return false;
    }

    const client = this.activeClients.get(clientId);
    if (client) {
      client.roomId = roomId;
      client.userName = userName;
      this.rooms.set(roomId, true); // Mark room as occupied
      return true;
    }

    return false; // Return false if client doesn't exist
  }

  // Leave a room
  leaveRoom(clientId: string, roomId: string) {
    const client = this.activeClients.get(clientId);
    if (client && client.roomId === roomId) {
      client.roomId = null;
      this.rooms.set(roomId, false); // Mark room as available
    }
  }

  // Get client details
  getClient(clientId: string): Client | undefined {
    return this.activeClients.get(clientId);
  }

  // Store a message
  storeMessage(roomId: string, message: Message) {
    if (!this.messages[roomId]) {
      this.messages[roomId] = [];
    }
    this.messages[roomId].push(message);
  }

  // Get messages for a room
  getMessages(roomId: string): Message[] {
    return this.messages[roomId] || [];
  }
}
