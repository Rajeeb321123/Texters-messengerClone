
import getCurrentUser from "@/app/actions/getCurrentUser";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

// asyn function to await the current user
async function Sidebar({ children }: {
    children: React.ReactNode;
}) {
    const currentUser = await getCurrentUser();
    return (
        <div className="h-full">
            <DesktopSidebar currentUser={currentUser} />
            <MobileFooter currentUser={currentUser} />
            <main className="lg:pl-[90px] h-full">
            {children}
            </main>
        </div>
    );
};

export default Sidebar;