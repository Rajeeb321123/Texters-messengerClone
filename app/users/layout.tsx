
import getUsers from '../actions/getUsers';
import  Sidebar from '../components/sidebar/Sidebar';
import UserList from './components/UserList';

// async because we will be using it to fetch all the data
// as it is async function we dont need get api call
export default async function UserLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const users = await getUsers();
    return (

        <Sidebar>
            <div className='h-full'>
                <UserList items={users} />
                {children}
            </div>

        </Sidebar>
    )
};