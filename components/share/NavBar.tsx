import Logo from "../../public/assets/logo.png";
export default function NavBar() {
  return (
    <div className="fixed flex  border-b border-[#e1e1e1]  h-[70px]  w-full  justify-center max-md:hidden z-20 bg-white">
      <div className=" flex items-center gap-2 cursor-pointer capitalize text-2xl relative md:right-[10%]">
        <img src={Logo} alt="Logo" className="w-[40px] h-[40px]" />
      </div>
    </div>
  );
}
