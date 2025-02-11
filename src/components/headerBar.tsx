import Image from "next/image";
import { useRouter } from "next/navigation";

const HeaderBar = ({ bgColor }: {bgColor: string}) => {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleUserClick = () => {
    router.push('/conta');
  };

  return (
    <div className={`navbar fixed top-0 left-0 w-full place-content-between px-8 py-3 bg-[#${bgColor}] z-50`}>
      <div onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <Image
          src="/studaiLogo.png"
          width={120}
          height={120}
          alt="Studai Logo"
        />
      </div>
      <div onClick={handleUserClick} style={{ cursor: 'pointer' }}>
        <Image
          src="/user.svg"
          width={40}
          height={40}
          alt="user icon"
        />
      </div>
    </div>
  );
};

export default HeaderBar;
