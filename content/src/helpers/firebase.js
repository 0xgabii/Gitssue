import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBiqd6d8jky0XM-VJOaRy7EXoCUkAPor2k',
  authDomain: 'gitssue-2cd67.firebaseapp.com',
  databaseURL: 'https://gitssue-2cd67.firebaseio.com',
  storageBucket: 'gitssue-2cd67.appspot.com',
};

firebase.initializeApp(config);

export default firebase;
