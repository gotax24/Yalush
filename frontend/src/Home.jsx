import Carousel from "./components/Carousel";

const Home = () => {
  const images = [
    {
      src: "/img/karen-penroz-06ZTGDcAQFs-unsplash.webp",
      footer:
        'Foto de <a href="https://unsplash.com/es/@penrosekaren?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Karen Penroz</a> en <a href="https://unsplash.com/es/fotos/hilo-azul-y-rojo-sobre-superficie-blanca-06ZTGDcAQFs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
    },
    {
      src: "/img/karina-l-d1yqso_6tns-unsplash.webp",
      footer:
        'Foto de <a href="https://unsplash.com/es/@kumoknits?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Karina L</a> en <a href="https://unsplash.com/es/fotos/boligrafo-de-clic-rosa-y-plateado-sobre-textil-blanco-d1yqso_6tns?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
    },
    {
      src: "/img/anya-chernik-jyTY8dz3qk8-unsplash.webp",
      footer:
        'Foto de <a href="https://unsplash.com/es/@meshushe?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Anya Chernik</a> en <a href="https://unsplash.com/es/fotos/una-bolsa-llena-de-muchas-agujas-de-diferentes-colores-jyTY8dz3qk8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
    },
  ];

  return (
    <>
      <div className="container-hero">
        <Carousel images={images} />
      </div>
    </>
  );
};

export default Home;
