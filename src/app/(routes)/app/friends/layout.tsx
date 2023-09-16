import { TopNav, Item } from "@components/TopNav";

const items = [
  { to: "", text: "All" },
  { to: "online", text: "Online" },
  { to: "pending", text: "Pending" },
  { to: "blocked", text: "Blocked" },
];

export const metadata = {
  title: "Chat App | Friends",
};

export default function FriendsWindow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 w-full h-full text-white">
      <TopNav>
        {items.map((item, i) => (
          <Item to={`/app/friends/${item.to}`} key={i}>
            {item.text}
          </Item>
        ))}
        <Item
          className="bg-green-500 text-onSurface-dark dark:bg-green-500 dark:text-onSurface-dark hover:bg-green-500 dark:hover:bg-green-500"
          to="/app/friends/add_friend"
        >
          Add Friend
        </Item>
      </TopNav>
      {children}
    </div>
  );
}
