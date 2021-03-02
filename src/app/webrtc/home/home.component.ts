import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InputItemComponent } from 'ng-zorro-antd-mobile';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  @ViewChild('userNameInput') userNameInputElementRef:InputItemComponent;


  @ViewChild('roomInput') roomInputElementRef: InputItemComponent;


  constructor(public router:Router) { }

  get getRoomId(){
    return this.roomInputElementRef.value;
  }


  get getUserName(){
    return this.userNameInputElementRef.value;
  }
  joinRoom() {
    this.router.navigate(['/webrtc/room'],{queryParams:{roomId:this.getRoomId,userName:this.getUserName}});
  }
  ngOnInit() {
  }

}
