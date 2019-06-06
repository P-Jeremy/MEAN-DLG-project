
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

import * as socketIo from 'socket.io-client';

const SERVER_URL = environment.serverDomaine;

@Injectable()
export class SocketService {

  private socket: any;
  private dataUpdated = new Subject<any>();


  constructor() { }

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public getNews(): void {
    this.socket.on('NewData', (data: any) => {
      this.dataUpdated = data;
      return this.dataUpdated.asObservable();
    });
  }
}
