import Navbar from "./Navbar";
import Footer from "./Footer";

/* eslint-disable react/prop-types */
function Container({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
/* eslint-enable react/prop-types */

export default Container;
