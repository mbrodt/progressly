import { useEffect, useState } from "react";
import { useAuth } from "../src/authProvider";
import AddResourceForm from "../src/components/AddResourceForm";
import SignInForm from "../src/components/SignInForm";
import ProfileInfo from "../src/components/ProfileInfo";
import Timeline from "../src/components/Timeline";
import { db } from "../src/initFirebase";

export default function MyProfile() {
  const { user, loading } = useAuth();
  const [tempUserData, setTempUserData] = useState(null);

  useEffect(() => {
    if (user) {
      const ref = db.ref("users/" + user.displayName);
      ref.on("value", (snapshot) => {
        const value = snapshot.val();
        console.log("profile snapshot val", value);
        setTempUserData(snapshot.val());
      });
      return () => ref.off();
    }
  }, [user]);
  console.log("user: in profile", tempUserData);
  if (loading) return null; // TODO add spinner here
  if (!user) return <SignInForm />;
  return (
    <div className="flex-1 relative z-0 flex overflow-hidden">
      <main
        className="flex-1 relative z-0 overflow-y-auto focus:outline-none"
        tabIndex="0"
      >
        <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
          <div className="border-2 p-6 h-full border-gray-200 border-dashed rounded-lg">
            <ProfileInfo />
            <AddResourceForm resources={tempUserData?.resources} />
          </div>
        </div>
      </main>
      <aside className="hidden relative xl:flex xl:flex-col flex-shrink-0 w-1/3 border-l border-gray-200">
        <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
          <div className="h-full border-2 border-gray-200 border-dashed rounded-lg p-6">
            {" "}
            <Timeline resources={tempUserData?.resources} />
          </div>
        </div>
      </aside>
    </div>
  );
}
