import emailjs from '@emailjs/browser';

const Email = () => {
  const templateParams = {
    name: 'Ernesto',
    email: 'ejemplo@correo.com',
    message: 'Gracias por tu compra!',
  };

  emailjs.send(
    'service_xxxxxx',
    'template_xxxxxx',
    templateParams,
    'YOUR_PUBLIC_KEY'
  ).then(
    (response) => {
      console.log('Email enviado:', response.status, response.text);
    },
    (err) => {
      console.error('Error al enviar email:', err);
    }
  );
};

export default Email