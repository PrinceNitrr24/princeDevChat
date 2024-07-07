import React from "react";
const AuthLayouts = ({ children }) => {
  return (
    <>
      <header className="flex rounded-full  bg-slate-50 m-2 bg-transparent  justify-center items-center py-3 shadow-xl ">
        {/* <img src={chat} alt="logo" width={180} height={60} /> */}
        <h1 className="font-bold text-black text-2xl">
          <span>
            {"<"}
            {`PrinceDevChat`}❤{`/>`}💬
          </span>
        </h1>
      </header>
      {children}
    </>
  );
};

export default AuthLayouts;
