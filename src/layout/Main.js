import Footer from "@/components/footer/Footer";
import NavBar from "@/components/nav-bar/NavBar";
import React, { useState } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import Sidebar from "@/components/side-bar";
import Modal from "@/components/Modals/Modal";
import NextNProgress from "nextjs-progressbar";
import Accountsbar from "@/components/accountsbar";
import { getCookie } from "cookies-next";
import { ThemeProvider, useTheme } from "next-themes";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const Main = ({ children, displaySidebar = true }) => {
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const [metaMaskModal, setMetaMaskModal] = useState(false);
  const [accountSidebarOpen, setaccountSidebarOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={"dark"}
      enableSystem={true}
      forcedTheme={theme}
    >
      <NextNProgress
        color="#29D"
        startPosition={0.3}
        stopDelayMs={200}
        height={4}
        showOnShallow={true}
      />

      {displaySidebar == true && (
        <Sidebar sidebar={sidebarOpen} setSideBar={setsidebarOpen} />
      )}
      {/* <div className="sm:w-full" /> */}
      <div
        className={`bg-white relative ml-0  ${
          displaySidebar == true && "md:ml-52 "
        } `}
      >
        <div className="">
          {/* <NavBar
            stateMetaMask={metaMaskModal}
            setMetaMask={setMetaMaskModal}
            accountSidebarOpen={accountSidebarOpen}
            setaccountSidebarOpen={setaccountSidebarOpen}
          /> */}
          {/* <p className="text-white">sdasdad</p> */}
          {children}
          <Accountsbar
            accountSidebarOpen={accountSidebarOpen}
            setaccountSidebarOpen={() =>
              setaccountSidebarOpen(!accountSidebarOpen)
            }
          />
        </div>
      </div>
      <Modal
        modalVisible={metaMaskModal}
        onClose={() => {
          setMetaMaskModal(false);
        }}
      />

      {/* <Footer /> */}
    </ThemeProvider>
  );
};

export default Main;
