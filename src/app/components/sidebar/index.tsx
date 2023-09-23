"use client";

import { MdPeopleAlt } from "react-icons/md";
import ConversationTab from "@components/ConversationTab";
import { useSession } from "next-auth/react";
import { useConversions } from "@hooks/useConversions";
import Item from "./item";

const SideBar: React.FC = () => {
  const { data: conversions } = useConversions();
  const { data: session } = useSession();

  return (
    <div
      id="sidebar"
      className="bg-surface-light dark:bg-surface-dark flex flex-col"
    >
      <ul className="p-3">
        <Item icon={MdPeopleAlt} navTo="/app/friends">
          Friends
        </Item>
      </ul>
      <div className="p-3 h-full overflow-y-auto max-h-full">
        {conversions &&
          conversions.map((conversion) => {
            const {
              id,
              is_group,
              title,
              members,
              profile,
              createdAt,
              unseenCount,
            } = conversion;
            const image = profile || members[0].image;
            const name = is_group ? title : members[0].name;
            return (
              <ConversationTab
                className="bg-surface-light dark:bg-surface-dark"
                key={id}
                id={id}
                unseenCount={unseenCount}
                image={image}
                name={name}
                time={createdAt.substring(11, 16)}
                status={"offline"}
                lastStatus={status || "offline"}
              />
            );
          })}
      </div>
      <ConversationTab
        id={session?.user.id || ""}
        image={session?.user.image || ""}
        name={session?.user.name || ""}
        lastStatus="Your Profile"
      />
    </div>
  );
};

export default SideBar;
