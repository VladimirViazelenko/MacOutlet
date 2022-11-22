let formLogin = document.getElementById('form-auth-login');
let username = document.getElementById('username');
let password = document.getElementById('password');

function authLogin () {
  let xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://localhost:3000/auth/login', true)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  let body = 'username=' + encodeURIComponent(username) +
  '&password=' + encodeURIComponent(password);

  /* xhr.onload = function() {
    if (xhr.status != 200) { 
      alert(`Error ${xhr.status}: ${xhr.statusText}`); 
    } else { 
      alert( ${xhr.response}`); 
    } return;
  }; */
  
 /* xhr.onload = function() {
  let responseObj = xhr.response;
  alert(responseObj.message); // Hello, world!
 }; */

 xhr.onerror = function() {
    alert("Request failed");
 };

 xhr.send(body)
}

