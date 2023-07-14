import getConversations from "../actions/getConversations"
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar"
import { FullConversationType } from "../types";
import ConversationsList from "./components/ConversationsList"

export default async function ConversationsLayout({
    children
}: {
    children: React.ReactNode
}) {
    // as layout.tsx is async function so we can safetly load the getConversations
    const conversations = await getConversations();
    const users = await getUsers();

    return (
        <Sidebar>
            <div className="h-full">
                <ConversationsList
                    users={users}
                    initialItems={conversations}
                />
                {children}
            </div>
        </Sidebar>
    )
}