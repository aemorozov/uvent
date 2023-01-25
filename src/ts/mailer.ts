const emailjs = require('@emailjs/browser');
const btn = <HTMLFormElement>document.getElementById('button');

emailjs.init("D32-TRfUefWjSF0BO");

document.getElementById('form')?.addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Отправляется...';

   const serviceID = 'default_service';
   const templateID = 'template_j2n3uuh';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Отправить';
      alert('Sent!');
    }, (err: Error) => {
      btn.value = 'Отправить';
      alert(JSON.stringify(err));
    });
});