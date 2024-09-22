import { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage";
import { Button } from "~components/Button/Button";
import { TabFeed } from "~components/TabFeed/TabFeed";
import Tabs from "~components/Tabs/Tabs";
// @ts-ignore
import icon from "./assets/icon.png";
import { deleteAllStorage } from "./contentScripts/storage";
import "./index.scss";
import { InputToggle } from "~components/InputToggle/InputToggle";
import SignIn from "~components/SignIn/SignIn";
import { TabConnections } from "~components/TabConnections/TabConnections";
import { TabJobs } from "~components/TabJobs/TabJobs";
import { auth } from "./firebaseConfig"; // Import Firebase Auth
import { onAuthStateChanged, signOut } from "firebase/auth";  // Import signOut from Firebase
import { MdOutlineLogout } from "react-icons/md";

function IndexPopup() {
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(false);
  const [authState, setAuthState] = useState<boolean | null>(null); // Null means loading

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setAuthState(true); // User is authenticated
      } else {
        setAuthState(false); // User is not authenticated
      }
    });

    const fetchStorageData = async () => {
      const storage = new Storage();
      const storedEnabledState = await storage.get("enabled");
      const isEnabledValue = !!storedEnabledState;
      setIsExtensionEnabled(isEnabledValue);
    };

    fetchStorageData();

    // Cleanup the auth listener on component unmount
    return () => unsubscribe();
  }, []);

  const tabData = [
    { id: "tab1", label: "Feed", content: <TabFeed /> },
    { id: "tab2", label: "Vagas", content: <TabJobs /> },
    { id: "tab3", label: "Minha Rede", content: <TabConnections /> },
  ];

  const handleToggleChange = async (enabled: boolean) => {
    setIsExtensionEnabled(enabled);
    const storage = new Storage();
    await storage.set("enabled", enabled);
  };

  const handleAuthSuccess = () => {
     setAuthState(true); // Set auth to true once the user logs in successfully
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);  // Sign out the user
      setAuthState(false);  // Update the state to reflect logged-out status
      // await deleteAllStorage();  // Optionally clear all storage related to the extension
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="container">
      <div>
        <div>
          <img width={50} src={icon} />
          <h1>GolfIn Beta</h1>
        </div>
        <h4>A sua extensão para o LinkedIn!</h4>
      </div>

      {authState === null ? (
        // Loading state
        <div>Carregando...</div>
      ) : authState ? (
        // Show the main content if authenticated
        <>
          <InputToggle
            label="Habilitar extensão"
            value={isExtensionEnabled}
            onChange={handleToggleChange}
          />
          <Tabs tabs={tabData} />


          <div className="sign-out-button">
            <Button onClick={handleSignOut}>
            <MdOutlineLogout />  Sair
            </Button>
          </div>
     
        </>
      ) : (
     
        <SignIn onSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default IndexPopup;
