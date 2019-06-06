
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import * as socketIo from 'socket.io-client';

const SERVER_URL = environment.serverDomain;

@Injectable({ providedIn: 'root' })
export class SocketService {

  private socket: any;

  constructor() { }

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL, {transports: ['websocket']});
  }

  public getNews(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('NewData', (data: any) => observer.next(data));
    });
  }
}
