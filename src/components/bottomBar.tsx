import { useState, useEffect } from 'react';

const BottomBar = ({ bgColor }: {bgColor: string}) => {
  return (
    <div className={`fixed bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#${bgColor}] to-transparent  z-50`}/>
  );
};

export default BottomBar;
