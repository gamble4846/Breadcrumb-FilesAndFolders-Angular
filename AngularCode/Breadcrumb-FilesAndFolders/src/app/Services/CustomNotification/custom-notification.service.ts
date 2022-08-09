import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class CustomNotificationService {

  constructor(private notification: NzNotificationService, private message: NzMessageService) { }

  BigNotification(title:any, content:any){
    this.notification
      .blank(
        title,
        content
      )
      .onClick.subscribe(() => {
        console.log('notification clicked!');
      });
  }

  SmallMessage(type:any, message:any){
    this.message.create(type, message);
  }
}
