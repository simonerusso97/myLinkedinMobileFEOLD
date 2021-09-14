import { Component, OnInit } from '@angular/core';
import {Regular} from '../../models/regular';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {LoadingController} from '@ionic/angular';
import {Geolocation} from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-regular-login',
  templateUrl: './regular-login.component.html',
  styleUrls: ['./regular-login.component.scss'],
})

export class RegularLoginComponent implements OnInit {

  loginError = {
    error: false,
    message: null
  };
  localizationError = {
    error: false,
    message: null
  };
  disabledError = {
    error: false,
    message: 'L\'amministratore non ha ancora approvato la tua richiesta di registrazione'
  };
  bannedError = {
    error: false,
    message: 'Sei stato temporanemente bannato'
  };
  adminError = {
    error: false,
    message: 'Non ti è consentito l\'accesso a questa interfaccia'
  };
  regular: Regular = {} as Regular;

  constructor(private userService: UserService, private route: Router, public loadingController: LoadingController,
              private geo: Geolocation) {
  }

  ngOnInit() {
  }

  login() {
    this.userService.login(this.regular).subscribe(
      response => {
        this.loginError.error = false;
        this.disabledError.error = false;
        this.bannedError.error = false;

        if (response.disabled) {
          this.disabledError.error = true;
        } else if (response.banned) {
          this.bannedError.error = true;
        } else if (response.type === 'admin') {
          this.adminError.error = true;
        } else {
          sessionStorage.setItem('user', JSON.stringify(response));
          this.presentLoading();
        }
      },
      error => {
        this.loginError.error = true;
        this.loginError.message = 'Errore durante il login: \n' + error;
      });
  }

  navigateTo(signup: string) {
    this.route.navigateByUrl(signup, {
      replaceUrl: true
    });
  }

  private async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Attendi localizzazione',
    });
    await loading.present();

    this.geo.getCurrentPosition({
      timeout: 10000,
      enableHighAccuracy: true
    })
      .then((response) => {
        //TODO: se serve l'import di geo modifica
        sessionStorage.setItem('coordinates', JSON.stringify(response.coords));
        loading.dismiss();
        /*this.route.navigateByUrl(
          '/tabs',
          {
            replaceUrl : true
          });*/
      })
      .catch((error) => {
        loading.dismiss();
        this.localizationError.error = true;
        this.localizationError.message = 'Errore duarente la geolocalizzazione: \n' + error;
        sessionStorage.clear();
      });
  }
}

    /*Geolocation.prototype.getCurrentPosition(
      response => {
        sessionStorage.setItem('coordinates', JSON.stringify(response.coords));
        loading.dismiss();
        /!*this.route.navigateByUrl('/tabs',{
          replaceUrl : true
        });*!/
      },
      error => {
        loading.dismiss();
        this.localizationError.error = true;
        this.localizationError.message = 'Errore duarente la geolocalizzazione: \n' + error;
        sessionStorage.clear();
      },
      {
        timeout: 1000,
        enableHighAccuracy: true
      }
    );*/

