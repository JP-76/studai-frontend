import Image from "next/image";

const LogoImage = () => {
  return (
      <Image
        src="/studaiLogo.png"
        alt="Logo"
        width={200}
        height={0}
        className=""
      />
  );
};

export default LogoImage;
