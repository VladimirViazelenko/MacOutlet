let formRegister = document.getElementById('form-auth-register')
let username = document.getElementById('username');
let password = document.getElementById('password');
let email = document.getElementById('email');

function authRegister () {
  let xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://localhost:3000/auth/register', true)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  let body = 'username=' + encodeURIComponent(username) +
  '&email=' + encodeURIComponent(email) +
  '&password=' + encodeURIComponent(password);

   xhr.onload = function() {
    if (xhr.status != 200) { 
      alert(`Error ${xhr.status}: ${xhr.statusText}`); 
    } else { 
      alert(`Done, got ${xhr.response.length} bytes`); 
    } return;
};

xhr.onerror = function() {
   alert("Request failed");
};

xhr.send(body)
}



  /* xhr.onreadystatechange = function() {
  if (xhr.readyState == 3) {
    // загрузка
  }
  if (xhr.readyState == 4) {
    // запрос завершён
  }
}; */