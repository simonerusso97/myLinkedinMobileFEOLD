import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Applicant } from 'src/app/models/applicant';
import { Offeror } from 'src/app/models/offeror';
import { PostService } from 'src/app/services/post.service';
import {Post} from '../../models/post';
import {UserService} from '../../services/user.service';


@Component({
  selector: 'app-saved-post',
  templateUrl: './saved-post.page.html',
  styleUrls: ['./saved-post.page.scss'],
})
export class SavedPostPage implements OnInit {

  post: Post = {} as Post;
  user: Offeror | Applicant;
  err = false;
  private message: string;

  constructor(private routes: Router, private postService: PostService, public toastController: ToastController,
              private userService: UserService) {
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));

    if (this.user == null) {
      this.routes.navigateByUrl('login');
    } else {
      if ((typeof this.user.interestedPostList) == 'undefined') {
        this.user.interestedPostList = [];
      }
    }

  }

  unsavePost(post: Post): void {
    console.log(post.id);
    this.user.interestedPostList.forEach(item =>{
      console.log(item.id);
    });
    console.log(this.user.interestedPostList);
    this.userService.unsavePost(this.user, post.id).subscribe(
      response => {
        this.user.interestedPostList = this.user.interestedPostList.filter(item => item.id != post.id);
        sessionStorage.setItem('user', JSON.stringify(this.user));
        this.message='Operazione completata';
        this.presentToast();
      },
      error => {
        this.err = true;
        this.message = 'Si è verificato un errore, riprova';
        this.presentToast();
      });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.message,
      duration: 2000
    });
    toast.present();
  }
}




