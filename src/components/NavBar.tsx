import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      label: "홈",
      path: "/",
      icon: (isActive: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <g clipPath="url(#clip0)">
            <path
              d="M21 20.0003C21 20.2655 20.8946 20.5198 20.7071 20.7074C20.5196 20.8949 20.2652 21.0003 20 21.0003H4C3.73478 21.0003 3.48043 20.8949 3.29289 20.7074C3.10536 20.5198 3 20.2655 3 20.0003V9.49027C2.99989 9.33788 3.03462 9.18749 3.10152 9.05057C3.16841 8.91365 3.26572 8.79384 3.386 8.70027L11.386 2.47827C11.5615 2.34172 11.7776 2.26758 12 2.26758C12.2224 2.26758 12.4385 2.34172 12.614 2.47827L20.614 8.70027C20.7343 8.79384 20.8316 8.91365 20.8985 9.05057C20.9654 9.18749 21.0001 9.33788 21 9.49027V20.0003ZM19 19.0003V9.97827L12 4.53427L5 9.97827V19.0003H19Z"
              fill={isActive ? "#FFC845" : "#C1C1C1"}
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      label: "티치맵",
      path: "/techmap",
      icon: (isActive: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <g clip-path="url(#clip0_2736_3541)">
            <path
              d="M6.914 16.0001L17.056 5.85808L15.642 4.44408L5.5 14.5861V16.0001H6.914ZM7.743 18.0001H3.5V13.7571L14.935 2.32208C15.1225 2.13461 15.3768 2.0293 15.642 2.0293C15.9072 2.0293 16.1615 2.13461 16.349 2.32208L19.178 5.15108C19.3655 5.33861 19.4708 5.59292 19.4708 5.85808C19.4708 6.12325 19.3655 6.37756 19.178 6.56508L7.743 18.0001ZM3.5 20.0001H21.5V22.0001H3.5V20.0001Z"
              fill={isActive ? "#FFC845" : "#C1C1C1"}
            />
          </g>
          <defs>
            <clipPath id="clip0_2736_3541">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      label: "리터치",
      path: "/retouch",
      icon: (isActive: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
          <g clip-path="url(#clip0_2736_3525)">
            <path d="M13.5 21V23H11.5V21H3.5C3.23478 21 2.98043 20.8946 2.79289 20.7071C2.60536 20.5196 2.5 20.2652 2.5 20V4C2.5 3.73479 2.60536 3.48043 2.79289 3.2929C2.98043 3.10536 3.23478 3 3.5 3H9.5C10.0676 2.99933 10.6288 3.11976 11.1461 3.35325C11.6635 3.58674 12.125 3.92792 12.5 4.354C12.875 3.92792 13.3365 3.58674 13.8539 3.35325C14.3712 3.11976 14.9324 2.99933 15.5 3H21.5C21.7652 3 22.0196 3.10536 22.2071 3.2929C22.3946 3.48043 22.5 3.73479 22.5 4V20C22.5 20.2652 22.3946 20.5196 22.2071 20.7071C22.0196 20.8946 21.7652 21 21.5 21H13.5ZM20.5 19V5H15.5C14.9696 5 14.4609 5.21072 14.0858 5.58579C13.7107 5.96086 13.5 6.46957 13.5 7V19H20.5ZM11.5 19V7C11.5 6.46957 11.2893 5.96086 10.9142 5.58579C10.5391 5.21072 10.0304 5 9.5 5H4.5V19H11.5Z"
              fill={isActive ? "#FFC845" : "#C1C1C1"}
            />
          </g>
          <defs>
            <clipPath id="clip0_2736_3525">
              <rect width="24" height="24" fill="white" transform="translate(0.5)"/>
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      label: "마이",
      path: "/mypage",
      icon: (isActive: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <g clip-path="url(#clip0_2736_3533)">
            <path d="M20 22H18V20C18 19.2044 17.6839 18.4413 17.1213 17.8787C16.5587 17.3161 15.7956 17 15 17H9C8.20435 17 7.44129 17.3161 6.87868 17.8787C6.31607 18.4413 6 19.2044 6 20V22H4V20C4 18.6739 4.52678 17.4021 5.46447 16.4645C6.40215 15.5268 7.67392 15 9 15H15C16.3261 15 17.5979 15.5268 18.5355 16.4645C19.4732 17.4021 20 18.6739 20 20V22ZM12 13C11.2121 13 10.4319 12.8448 9.7039 12.5433C8.97595 12.2417 8.31451 11.7998 7.75736 11.2426C7.20021 10.6855 6.75825 10.0241 6.45672 9.2961C6.15519 8.56815 6 7.78793 6 7C6 6.21207 6.15519 5.43185 6.45672 4.7039C6.75825 3.97595 7.20021 3.31451 7.75736 2.75736C8.31451 2.20021 8.97595 1.75825 9.7039 1.45672C10.4319 1.15519 11.2121 1 12 1C13.5913 1 15.1174 1.63214 16.2426 2.75736C17.3679 3.88258 18 5.4087 18 7C18 8.5913 17.3679 10.1174 16.2426 11.2426C15.1174 12.3679 13.5913 13 12 13ZM12 11C13.0609 11 14.0783 10.5786 14.8284 9.82843C15.5786 9.07828 16 8.06087 16 7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7C8 8.06087 8.42143 9.07828 9.17157 9.82843C9.92172 10.5786 10.9391 11 12 11Z"
              fill={isActive ? "#FFC845" : "#C1C1C1"}
            />
          </g>
          <defs>
            <clipPath id="clip0_2736_3533">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-screen h-[80px] bg-white z-50 flex justify-around items-center rounded-t-[32px]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center"
          >
            {item.icon(isActive)}
            <span
              className={`mt-1 text-sm ${isActive ? "text-[#FFC845]" : "text-[#C1C1C1]"}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default NavBar;