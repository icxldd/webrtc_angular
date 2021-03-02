import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {



  roomId: string;
  userName: string;
  chatSocket: any;
  mediaConstraints = { "audio": true, "video": true };


  localStream = null;

  peerList = {};

  //自己
  @ViewChild('videoMine') videoMine_: ElementRef;
  //别人
  @ViewChild('videoBox') videoBox_: ElementRef;

  videoBox: any;
  localVideo: any;


  constructor(private route: ActivatedRoute) {
    // this.roomId = '1';
    // this.userName = 'icxl';
    this.route.queryParams.subscribe(x => {
      let itemObj = x;
      this.roomId = itemObj.roomId;
      this.userName = itemObj.userName;
    });
  }
  ngOnInit(): void {

  }


/*sudo docker run -d -p 3478:3478 -p 3478:3478/udp --restart=always zolochevska/turn-server username password realm */
  sendHeart() {
    setInterval(() => {
      let heartEvent = { type: 'heart', roomid: this.roomId };
      this.chatSocket.send(JSON.stringify(heartEvent));
    }, 10000);
  }

  getPeerConnection(v: any) {
    let iceServer: any = {
      "iceServers": [
        {
          'urls': 'turn:121.5.78.63:3478',
          'credential': "password",
          'username': "username"
        },
      ]
    };


    var peer: any = new RTCPeerConnection(iceServer);
    peer.addStream(this.localStream);

    var hasAddTrack = (peer.addTrack !== undefined);

    if (hasAddTrack) {
      peer.ontrack = (event) => {
        let videos: any;
        try {
          videos = document.getElementById(v.account);
        } catch (e) { }
        if (videos) {
          videos.srcObject = event.streams[0];
        } else {
          let video: any = document.createElement('video');
          video.controls = true;
          video.autoplay = 'autoplay';
          video.srcObject = event.streams[0];
          video.id = v.account;
          this.videoBox.append(video);
        }
      }
    }
    else {
      peer.onaddstream = (event) => {
        let videos: any;
        try {
          videos = document.getElementById(v.account);
        } catch (e) { }
        if (videos) {
          videos.srcObject = event.stream;
        } else {
          let video: any = document.createElement('video');
          video.controls = true;
          video.autoplay = 'autoplay';
          video.srcObject = event.stream;
          video.id = v.account;
          this.videoBox.append(video);
        }
      };
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendMessage({
          type: '__ice_candidate',
          candidate: event.candidate,
          account: v.account
        });
      }
    };
    this.peerList[v.account] = peer;
  }

  userJoined(data, account) {
    if (data.length > 1) {//房间內有人进行peer初始化操作
      data.forEach(v => {
        let obj: any = {};
        let arr = [v, this.userName];
        obj.account = arr.sort().join('-');
        // this.debugPrint(obj.account);
        if (!this.peerList[obj.account] && v !== this.userName) {
          this.getPeerConnection(obj);
        }
      });

      // 自己进来给房间其它人发offer
      if (account === this.userName) {
        for (let k in this.peerList) {
          this.createOffer(k, this.peerList[k]);
        }
      }
    }
  }
  debugPrint(str) {
    console.log(str);
  }


  createOffer(account: any, peer: any) {
    //发送offer，发送本地session描述
    peer.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then((desc) => {
      peer.setLocalDescription(desc, () => {
        this.sendMessage({
          type: 'video-offer',
          sdp: peer.localDescription,
          account: account
        });
      });
    });
  }
  handleVideoOfferMsg(v) {
    this.peerList[v.account] && this.peerList[v.account].setRemoteDescription(v.sdp, () => {
      this.peerList[v.account].createAnswer().then((desc) => {
        this.peerList[v.account].setLocalDescription(desc, () => {
          this.sendMessage({
            type: 'video-answer',
            sdp: this.peerList[v.account].localDescription,
            account: v.account
          });
        });
      });
    }, () => { });
  }

  initRoomSignalling() {
    // this.chatSocket = new ReconnectingWebSocket('wss://192.168.31.114:3000');
    this.chatSocket = new ReconnectingWebSocket(environment.WebSocketUrl);




    let self = this;


    this.chatSocket.onmessage = function (evt) {
      if (evt.data == '1') {
        return;
      } else {
        var msg = JSON.parse(evt.data);
        console.log(msg);

        switch (msg.type) {
          case "joined":
            self.userJoined(msg.userList, msg.userName);
            break;
          case "__ice_candidate":
            //如果是一个ICE的候选，则将其加入到PeerConnection中
            if (msg.candidate) {
              self.peerList[msg.account] && self.peerList[msg.account].addIceCandidate(msg.candidate).catch(() => { }
              );
            }
            break;
          case "error":
            alert(msg.msg);
            break;
          // case "text":
          //   break;
          // 信令消息:这些消息用于在视频通话之前的谈判期间交换WebRTC信令信息。
          case "video-offer":  // 发送 offer
            self.handleVideoOfferMsg(msg);
            break;
          case "video-answer":  // Callee已经答复了我们的报价
            self.peerList[msg.account] && self.peerList[msg.account].setRemoteDescription(msg.sdp, function () { }, () => { });
            break;
          case "disconnected": // 有人挂断了电话
            console.log(msg.account);
            let dom = document.getElementById([msg.account, self.userName].sort().join('-'));
            if (dom) {
              dom.remove();
            }
            break;
          // 未知的信息;输出到控制台进行调试。
          default:
            console.log("未知的信息收到了:");
            console.log(msg);
        }
      }
    };

    //连接成功建立的回调方法
    this.chatSocket.onopen = function (event) {
      console.log("onopen");
    }
    //连接关闭的回调方法
    this.chatSocket.onclose = function () {
      // self.chatSocket.close();
      console.log("websocket.onclose");
    }
    //连接发生错误的回调方法
    this.chatSocket.onerror = function () {
      console.log("chatSocket.error");
    };
    window.onbeforeunload = function () {
      self.chatSocket.close();
    }


    this.sendHeart();
  }

  sendMessage(msg) {
    msg.roomid = this.roomId;
    this.chatSocket.send(JSON.stringify(msg));
  }

  async initlocalhostStream() {

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(this.mediaConstraints);
      this.localVideo.srcObject = this.localStream;
      this.sendMessage({
        userName: this.userName,
        type: 'join'
      });
    } catch (error) {
      console.log('获取本地摄像头失败：' + error);
    }
  }

  ngAfterViewInit() {
    this.videoBox = this.videoBox_.nativeElement;
    this.localVideo = this.videoMine_.nativeElement;

    this.initRoomSignalling();

    this.initlocalhostStream();

  }

}
