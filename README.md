# Protector
Helps user to protect their data from unauthorized access.

Protector is a file editor with crypto capabilities. You can use this editor to save your confidential information with a strong encryption and your own password. **we do not save passwords**.  Files are stored with `.akeys` extension. 

File can only be opened with the same password that was used to saving. If the user forgets the password, he/she won't be able to decrypt it back.

Right now it only supports `AES` encryption. We will add support for more algorithms in future.

## Screenshots
![Protector initial screen](https://github.com/in-akeys/Protector/blob/master/docs/screenshots/Initial.PNG)

![Password prompt](https://github.com/in-akeys/Protector/blob/master/docs/screenshots/password.PNG)

## Buid
npm install && npm start

## Create Installer
npm run dist
