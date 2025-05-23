import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { getFolders } from "@/lib/note/noteManager";
import FolderButton from "./folder-button";
import { Separator } from "../ui/separator";
import { Searchbar } from "./searchbar";
import Logo from "../Logo";
import { NavUser } from "./nav-user";
import AddFolder from "./add-folder";
import AddFile from "./add-file";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function AppSidebar() {
  const user = await currentUser();

  const folders = await getFolders();

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <p className="text-3xl font-semibold">Cognify</p>
          <Logo />
        </div>
        <div className="flex">
          <Searchbar className="mr-3 flex-1" />
          <AddFolder />
          <AddFile />
        </div>
      </SidebarHeader>
      <Separator className="bg-separator-gradient" />
      <SidebarContent className="flex flex-col gap-4 p-6">
        {folders.map((item, idx) => (
          <FolderButton key={idx} item={item} />
        ))}
      </SidebarContent>
      <Separator className="bg-separator-gradient" />
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.fullName || "",
            email: user?.primaryEmailAddress?.emailAddress || "",
            avatar: "/avatars/evil-rabbit.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
