import Image from "next/image";
import { useRouter } from "next/navigation";

const HeaderBar = () => {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleUserClick = () => {
    router.push('/conta');
  };

  return (
    <div className="navbar place-content-between px-8 py-3">
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
