import logoImg from "../assets/img/logo.png";
function Footer() {
  return (
    <>
      <footer>
        <div className="logo">
          <img src={logoImg} alt="" />
        </div>
        <div className="Title">
          <h3>CÔNG TY CỔ PHẦN SỮA VIDAIRY</h3>
        </div>
      </footer>
    </>
  );
}
export default Footer;
