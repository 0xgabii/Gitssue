const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:3000/app.js', true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // excute script
    const resp = eval(xhr.responseText);
  }
}
xhr.send();