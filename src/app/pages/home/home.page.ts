import {Component, OnInit} from '@angular/core';
import {Offeror} from '../../models/offeror';
import {Applicant} from '../../models/applicant';
import {Router} from '@angular/router';
import {Post} from '../../models/post';
import {PostService} from '../../services/post.service';
import {ToastController} from '@ionic/angular';
import {Geolocation} from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  user: Offeror | Applicant;
  postList: Post[] = [];
  err = false;
  lat: number;
  long: number;
  private message: string;

  constructor(private routes: Router, private postService: PostService, public toastController: ToastController,
              private geo: Geolocation) {}

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if(this.user == null){
      this.routes.navigateByUrl('login');
    }
    else {
      if (this.user.type === 'applicant'){
        this.user = this.user as Applicant;
      }
      else{
        this.user = this.user as Offeror;
      }
      this.postService.getPost(this.user).subscribe(
        response => {
          this.postList = response;
          this.err = false;
        },
        error => {
          this.err = true;
        });
      this.geo.getCurrentPosition({
        timeout:3000,
        enableHighAccuracy:true
      }).then((data)=>{
        this.lat=data.coords.latitude;
        this.long=data.coords.longitude;
        sessionStorage.setItem('latitude', String(this.lat));
        sessionStorage.setItem('longitude', String(this.long));
      }).catch((error)=>{
        console.log(error);
      });
    }
  }


  goToPost(post: Post) {
    this.postService.post = post;
    this.routes.navigateByUrl('postDetails');
  }

  save(post: Post) {

    if( typeof post.interestedUserList === 'undefined' || !post.interestedUserList.includes(this.user)) {
      post.interestedUserList.unshift(this.user);
      this.postService.updateInterested(post).subscribe(
        response => {
          this.message = 'Post salvato con successo';
          this.presentToast();
          this.postList.find(item => {
            if(item.id === post.id){
            item.interestedUserList.unshift(this.user);
              }
          });
        },
        error => {
          this.message = 'Si è verificato un errore';
          this.presentToast();
        });
    }
    else {
      this.message = 'Hai già salvato questo post';
      this.presentToast();
    }
  }

  goToComment(item: Post) {
    //TODO: Implementare
  }

  candidate(post: Post) {
    if( typeof post.candidationUserList === 'undefined' || !post.candidationUserList.includes(this.user)) {
      post.candidationUserList.unshift(this.user);
      this.postService.updateCandidation(post).subscribe(
        response => {
          this.message = 'Candidatura inviate con successo';
          this.presentToast();
          this.postList.find(item => {
            if(item.id === post.id){
              item.candidationUserList.unshift(this.user);
            }
          });
        },
        error => {
          this.message = 'Si è verificato un errore';
          this.presentToast();
        });
    }
    else {
      this.message = 'Hai già inviato la tua candidatura a questo post';
      this.presentToast();
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.message,
      duration: 2000
    });
    toast.present();
  }
}
