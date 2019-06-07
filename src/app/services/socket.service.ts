
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import * as socketIo from 'socket.io-client';

const SERVER_URL = environment.serverDomain;

@Injectable({ providedIn: 'root' })
export class SocketService {

  private socket: SocketIOClient.Socket;

  constructor() { }

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL, {transports: ['websocket']});
  }

  public getNews(): Observable<void> {
    return new Observable<void>(observer => {
      this.socket.on('NewData', () => observer.next());
    });
  }
}
