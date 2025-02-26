import Routers from "@routes/Routes.jsx";
import Header from "@components/Header.jsx";
import Footer from "@components/Footer.jsx";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Routers />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
