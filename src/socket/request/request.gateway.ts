import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
@WebSocketGateway({ namespace: 'friends' })
export class FriendRequestGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private activeUsers = new Map<string, string>(); // Maps socket ID to username
  private friendRequests = new Map<string, Set<string>>(); // Maps username to a set of incoming friend requests

  // async handleConnection(client: Socket) {
  //   const username = client.handshake.query.username as string;
  //   this.activeUsers.set(client.id, username);
  //   console.log(`User ${username} connected`);
    
  //   // Emit the list of active users to the new client
  //   client.emit('active_users', Array.from(this.activeUsers.values()));
  // }
  // async handleDisconnect(client: Socket) {
  //   const username = this.activeUsers.get(client.id);
  //   this.activeUsers.delete(client.id);
  //   console.log(`User ${username} disconnected`);
  // }
  // Helper method to emit active users excluding the current user
  emitActiveUsers(client: Socket) {
    const activeUsernames = [...this.activeUsers.values()].filter(
      (username) => username !== this.activeUsers.get(client.id),
    );
    client.emit('active_users', activeUsernames);

    // Broadcast to other users
    client.broadcast.emit('active_users', activeUsernames);
  }
  async handleConnection(client: Socket) {
    const username = client.handshake.query.username as string;
    this.activeUsers.set(client.id, username);
    console.log(`User ${username} connected`);

    // Broadcast the list of active users, excluding the current user
    this.emitActiveUsers(client);
  }

  async handleDisconnect(client: Socket) {
    const username = this.activeUsers.get(client.id);
    this.activeUsers.delete(client.id);
    console.log(`User ${username} disconnected`);

    // Broadcast the updated list of active users after disconnection
    this.emitActiveUsers(client);
  }


  @SubscribeMessage('send_friend_request')
  async handleSendRequest(
    @MessageBody() data: { to: string },
    @ConnectedSocket() client: Socket,
  ) {
    const from = this.activeUsers.get(client.id);
    const to = data.to;

    if (!from || !to) {
      client.emit('error', 'Invalid request.');
      return;
    }

    // Add to recipient's friend request list
    if (!this.friendRequests.has(to)) {
      this.friendRequests.set(to, new Set());
    }
    this.friendRequests.get(to)!.add(from);

    // Notify the recipient if they are online
    const recipientSocketId = [...this.activeUsers.entries()]
      .find(([_, username]) => username === to)?.[0];
    if (recipientSocketId) {
      client.to(recipientSocketId).emit('friend_request_received', { from });
    }

    client.emit('friend_request_sent', { to });
  }

  @SubscribeMessage('respond_friend_request')
  async handleRespondRequest(
    @MessageBody() data: { from: string; accepted: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const to = this.activeUsers.get(client.id);
    const from = data.from;

    if (!to || !from) {
      client.emit('error', 'Invalid response.');
      return;
    }

    const requests = this.friendRequests.get(to);
    if (requests && requests.has(from)) {
      requests.delete(from);
      client.emit('friend_request_responded', { from, accepted: data.accepted });

      const senderSocketId = [...this.activeUsers.entries()]
        .find(([_, username]) => username === from)?.[0];
      if (senderSocketId) {
        client.to(senderSocketId).emit('friend_request_response', {
          to,
          accepted: data.accepted,
        });
      }
    } else {
      client.emit('error', 'No friend request from this user.');
    }
  }
}
