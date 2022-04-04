import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Auth } from 'aws-amplify';
import { AlertService } from '../services/alert/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  isSigningIn: Boolean = true;
  isSigningUp: Boolean = false;
  isResetingPassword: Boolean = false;
  isConfirmingCode: Boolean = false;
  codeWasSent: Boolean = false;
  createAccountCodeSent: Boolean = false;
  userCode: number;
  userCodeResetingPassword: number;
  userNewPassword: string;

  constructor(private fb: FormBuilder, private alertService: AlertService) { }

  validatorFormSingIn = this.fb.group({
    userEmail: ['', [Validators.required, Validators.maxLength(256)]],
    userPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(256)]]
  });

  validatorFormSingUp = this.fb.group({
    userEmail: ['', [Validators.required, Validators.maxLength(256)]],
    userPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(256)]]
  });

  validatorFormResetPassword = this.fb.group({
    userEmail: ['', [Validators.required, Validators.maxLength(256)]]
  });

  validatorFormConfirmCode = this.fb.group({
    userEmail: ['', [Validators.required, Validators.maxLength(256)]],
    userCode: ['', [Validators.required, Validators.minLength(1)]]
  });

  ngOnInit() {}

  createAccount() { 
    this.isSigningUp = true; 
    this.isSigningIn = false;
    this.isResetingPassword = false; 
    this.isConfirmingCode = false;
  }

  resetPassword() { 
    this.isResetingPassword = true;  
    this.isSigningIn = false;
    this.isSigningUp = false; 
    this.isConfirmingCode = false;
  }

  signIn(){
    this.isSigningIn = true;
    this.isSigningUp = false; 
    this.isResetingPassword = false; 
    this.isConfirmingCode = false;
    this.createAccountCodeSent = false;
    this.codeWasSent = false;
  }

  confirmCode(){
    this.isConfirmingCode = true;
    this.isSigningIn = false;
    this.isSigningUp = false; 
    this.isResetingPassword = false; 
  }

  resendCode(){
    this.resendSignUpCode(this.validatorFormSingUp.get('userEmail').value);
  }

  resendCodeConfirmingCode(){
    this.resendSignUpCode(this.validatorFormConfirmCode.get('userEmail').value);
  }

  resendCodeResetingPassword(){
    this.resendSignUpCode(this.validatorFormResetPassword.get('userEmail').value);
  }

  onSubmitResetPassword(){
    this.forgotPassword(this.validatorFormResetPassword.get('userEmail').value);
  }

  onSubmitVerifyResetPassword(){
    console.log('verifyCode');
    this.forgotPasswordSubmit(this.validatorFormResetPassword.get('userEmail').value, this.userCodeResetingPassword, this.userNewPassword);
  }

  onSubmitSignUp(){
    this.signUpUser(this.validatorFormSingUp.get('userEmail').value, this.validatorFormSingUp.get('userPassword').value);
  }

  onSubmitConfirmCodeSignUp(){
    this.confirmSignUpUser(this.validatorFormSingUp.get('userEmail').value, this.userCode);
  }

  onSubmitSignIn() {
    this.signInUser(this.validatorFormSingIn.get('userEmail').value, this.validatorFormSingIn.get('userPassword').value);
  }

  onSubmitConfirmCode(){
    this.confirmSignUpUser(this.validatorFormConfirmCode.get('userEmail').value, this.validatorFormConfirmCode.get('userCode').value);
  }

  async signInUser(username, password) {
    try {
        const user = await Auth.signIn(username, password);
        /*if (user.challengeName === 'SMS_MFA' ||
            user.challengeName === 'SOFTWARE_TOKEN_MFA') {
            // You need to get the code from the UI inputs
            // and then trigger the following function with a button click
            const code = getCodeFromUserInput();
            // If MFA is enabled, sign-in should be confirmed with the confirmation code
            const loggedUser = await Auth.confirmSignIn(
                user,   // Return object from Auth.signIn()
                code,   // Confirmation code  
                mfaType // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
            );
        } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            const {requiredAttributes} = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
            // You need to get the new password and required attributes from the UI inputs
            // and then trigger the following function with a button click
            // For example, the email and phone_number are required attributes
            const {username, email, phone_number} = getInfoFromUserInput();
            const loggedUser = await Auth.completeNewPassword(
                user,              // the Cognito User Object
                newPassword,       // the new password
                // OPTIONAL, the required attributes
                {
                    email,
                    phone_number,
                }
            );
        } else*/ if (user.challengeName === 'MFA_SETUP') {
            // This happens when the MFA method is TOTP
            // The user needs to setup the TOTP before using it
            // More info please check the Enabling MFA part
            Auth.setupTOTP(user);
        } else {
            // The user directly signs in
            console.log(user);
            this.alertService.presentToast('Logged in successfully. Welcome', 1000, 'error');
            localStorage.setItem('jwtToken', user.signInUserSession.idToken.jwtToken);
        }
    } catch (err) {
        if (err.code === 'UserNotConfirmedException') {
            // The error happens if the user didn't finish the confirmation step when signing up
            // In this case you need to resend the code and confirm the user
            // About how to resend the code and confirm the user, please check the signUp part
            console.log(err);
            this.alertService.presentToast(err.message, 2500, 'error');
        } else if (err.code === 'PasswordResetRequiredException') {
            // The error happens when the password is reset in the Cognito console
            // In this case you need to call forgotPassword to reset the password
            // Please check the Forgot Password part.
            console.log(err);
            this.alertService.presentToast(err.message, 2500, 'error');
        } else if (err.code === 'NotAuthorizedException') {
            // The error happens when the incorrect password is provided
            console.log(err);
            this.alertService.presentToast(err.message, 2500, 'error');
        } else if (err.code === 'UserNotFoundException') {
            // The error happens when the supplied username/email does not exist in the Cognito user pool
            console.log(err);
            this.alertService.presentToast(err.message, 2500, 'error');
          } else {
            console.log(err);
            this.alertService.presentToast('Check for whitespaces in the email address', 2500, 'error');
        }
    }
  }

  signUpUser(username, password){
    let errorMessage: string = '';
    Auth.signUp({
      username,
      password,
      validationData: []  //optional
      })
      .then(data => { 
          console.log(data);
          this.alertService.presentToast('Code sent successfully', 2500, 'error');
          this.createAccountCodeSent = true; 
      })
      .catch(err => {
          console.log(err)
          if (err.name === 'InvalidParameterException'){
            this.alertService.presentToast(err.message, 2500, 'error');
          } else if (err.name === 'LimitExceededException'){
            this.alertService.presentToast('Attempt limit exceeded, please wait', 2500, 'error');
          } else {
            errorMessage = err.message;
            this.alertService.presentToast(errorMessage.replace('Password did not conform with policy: ', ''), 2500, 'error');
          }
      });
  }

  confirmSignUpUser(username, code){
    let errorMessage: string = '';
    Auth.confirmSignUp(username, code, {
        // Optional. Force user confirmation irrespective of existing alias. By default set to True.
        forceAliasCreation: true    
    }).then(data => {
          console.log(data);
          this.alertService.presentToast('Account confirmed!', 2500, 'error');
          this.isSigningIn = true;
          this.isSigningUp = false;
          this.isResetingPassword = false;
          this.isConfirmingCode = false;
          this.codeWasSent = false;
      })
      .catch(err => {
          console.log(err);
          if (err.name === 'CodeMismatchException') {
            errorMessage = err.message;
            this.alertService.presentToast(errorMessage.replace(', please try again.', ''), 2500, 'error');
          } else if (err.name === 'NotAuthorizedException') {
            this.alertService.presentToast('User already confirmed', 2500, 'error');
          } else if (err.name === 'LimitExceededException'){
            this.alertService.presentToast('Attempt limit exceeded, please wait', 2500, 'error');
          } else if (err.name === 'InvalidParameterException') {
            this.alertService.presentToast('Password must have length greater than or equal to 8', 2500, 'error');
          } else {
            this.alertService.presentToast(err.message, 2500, 'error');
          }
      });
  }

  resendSignUpCode(username){
    Auth.resendSignUp(username).then(() => {
       this.alertService.presentToast('Code resent successfully', 2500, 'error');
      }).catch(e => {
          if (e.name === 'UserNotFoundException') {
            this.alertService.presentToast('Username/client id combination not found', 2500, 'error');
          } else if (e.name === 'NotAuthorizedException') {
            this.alertService.presentToast('User already confirmed', 2500, 'error');
          } else if (e.name === 'InvalidParameterException') {
            this.alertService.presentToast(e.message, 2500, 'error');
          } else if (e.name === 'LimitExceededException'){
            this.alertService.presentToast('Attempt limit exceeded, please wait', 2500, 'error');
          } else {
            this.alertService.presentToast('Username cannot be empty', 2500, 'error');
          }
          console.log('me');
          console.log(e);
    });
  }

  forgotPassword(username){
    Auth.forgotPassword(username)
    .then(data => {
      console.log(data);
      this.codeWasSent = true;
      this.alertService.presentToast('Code sent successfully', 2500, 'error');
      })
    .catch(err => {
      console.log(err);
      this.alertService.presentToast(err.message, 2500, 'error');
    });
  }

  forgotPasswordSubmit(username, userCodeResetingPassword, userNewPassword){
    let errorMessage: string = '';
    Auth.forgotPasswordSubmit(username, userCodeResetingPassword, userNewPassword)
    .then(data => {
      console.log(data);
      this.alertService.presentToast('Password changed successfully', 2500, 'error');
      this.isSigningIn = true;
      this.isSigningUp = false;
      this.isResetingPassword = false;
      this.isConfirmingCode = false;
    })
    .catch(err => {
      if (err.name === 'CodeMismatchException') {
        errorMessage = err.message;
        this.alertService.presentToast(errorMessage.replace(', please try again.', ''), 2500, 'error');
      } else if (err.name === 'InvalidPasswordException') {
        errorMessage = err.message;
        this.alertService.presentToast(errorMessage.replace('Password does not conform to policy: ', ''), 2500, 'error');
      } else if (err.name === 'LimitExceededException'){
        this.alertService.presentToast('Attempt limit exceeded, please wait', 2500, 'error');
      } else if (err.name === 'InvalidParameterException') {
        this.alertService.presentToast("Password's length must be greater or equal to 8", 2500, 'error');
      } else {
        this.alertService.presentToast(err.message, 2500, 'error');
      }
    });
  }
}
