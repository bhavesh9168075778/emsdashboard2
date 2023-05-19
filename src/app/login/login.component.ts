import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  hide = true;
  buttonMode = '';
  showMessage;
  responseCode;

  constructor(private router: Router, private loginService: LoginService, private globalService: GlobalService) { }
  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    pass: new FormControl('', [Validators.required]),
  });
  
  submit() {
    this.buttonMode = 'indeterminate';
    if (this.form.valid) {
      console.log("form data=======", this.form.value)
      if(this.form.value.email === 'dtms@gmail.com'){
        this.buttonMode = '';
        this.responseCode = '-1';
        this.showMessage = 'Invalid Credentials'; 
      }else{
        this.loginService.checkCredential(this.form.value).subscribe((response: any) => {
          console.log("response=======", response)
          if (response && response.code === '1') {
            if (localStorage.getItem('token')) {
              this.buttonMode = '';
              alert("Kindly logout from previous session");
            } else {
              this.responseCode = response.code;
              this.globalService.setLoginLocalStorage(response);
              let audio = new Audio();
              audio.src = "assets/sound/Welcome.mp3";
              audio.load();
              audio.play();
              if(response.dashboard === 2){
                if(response.roleid == 1){
                  this.router.navigate(['/energymetermanager']);                 
                } else{
                  this.router.navigate(['/ems']);
                }
              } else {
                  this.router.navigate(['/dashboard']);
              }

            }
  
          } else {
            this.buttonMode = '';
            this.responseCode = response.code;
            let audio = new Audio();
            audio.src = "assets/sound/sorryaudio.mp3";
            audio.load();
            audio.play();
            this.showMessage = 'Invalid Credentials';
          }
        }) 
      }

    } else {
      this.buttonMode = '';
    }
  }

}
