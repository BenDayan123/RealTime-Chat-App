import { useEffect, useRef, useState } from "react";
import { MdPersonAdd } from "react-icons/md";
import Input from "../inputs/input";
import { useDebounce } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import LineSpinner from "@components/loaders/lineSpinner";
import Option from "./item";
import { isDeepEqual } from "@lib/utils";

export interface SearchedUser {
  id: string;
  image: string;
  name: string;
  email: string;
}

interface Props {
  onSelected: (data: any) => void;
  selected: any[];
}

async function searchUsers(query: string) {
  const res = await axios.get<SearchedUser[]>("/api/user/search", {
    params: { query },
  });
  return res.data ?? [];
}

const AutoComplete: React.FC<Props> = ({ onSelected, selected }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setFocus] = useState(false);
  const wrapperRef = useRef<any>(null);
  const debouncedQuery = useDebounce<string>(query, 500);
  const { data, isFetching } = useQuery({
    queryKey: ["search", "user", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: !!query,
    select: (data) =>
      data.filter((e) => !selected.some((select) => isDeepEqual(e, select))),
    staleTime: 500,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const { current } = wrapperRef;
      if (current && !current.contains(e.target)) {
        setFocus(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="group relative max-w-full" ref={wrapperRef}>
      <Input
        icon={MdPersonAdd}
        name={"Add User"}
        onFocus={() => setFocus(true)}
        className="m-0 focus-within:rounded-none"
        onChange={(e) => setQuery(e.target.value)}
      />
      <AnimatePresence>
        {isFocused && data?.length !== 0 && (
          <motion.div
            className="absolute mt-1 max-h-32 w-full overflow-auto rounded-md bg-surface-light text-base shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-surface-dark sm:text-sm"
            onClick={(e) => e.preventDefault()}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            initial={{ opacity: 0, height: 0 }}
            exit={{ opacity: 0, height: 0 }}
          >
            {isFetching && (
              <div className="relative inline-flex cursor-default select-none items-center px-4 py-2 text-gray-700">
                <LineSpinner size={18} /> Loading...
              </div>
            )}
            {!isFetching && data?.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              !isFetching &&
              data?.map((user) => (
                <Option
                  onClick={() => {
                    onSelected(user);
                    setFocus(false);
                  }}
                  data={user}
                  key={user.id}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutoComplete;
