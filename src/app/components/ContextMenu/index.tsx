import { useEffect, useLayoutEffect, useRef, useState } from "react";
export { Item } from "./item";
interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  items: React.ReactNode;
}

export const ContextMenuWrapper: React.FC<Props> = ({
  children,
  items,
  ...props
}) => {
  const { id: targetID, ...rest } = props;
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [showMenu, toggleMenu] = useState(false);
  const contextRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contextMenuEventHandler = (e: MouseEvent) => {
      if (itemRef.current && itemRef.current.contains(e.target as Node)) {
        e.preventDefault();
        setAnchorPoint({ x: e.clientX, y: e.clientY });
        toggleMenu(true);
      } else if (
        contextRef.current &&
        !contextRef.current.contains(e.target as Node)
      ) {
        toggleMenu(false);
      }
    };

    const offClickHandler = (e: MouseEvent | Event) => toggleMenu(false);

    document.addEventListener("scroll", offClickHandler, true);
    document.addEventListener("contextmenu", contextMenuEventHandler);
    document.addEventListener("click", offClickHandler);
    return () => {
      document.removeEventListener("contextmenu", contextMenuEventHandler);
      document.removeEventListener("click", offClickHandler);
      document.removeEventListener("scroll", offClickHandler, true);
    };
  }, [anchorPoint, targetID]);

  useLayoutEffect(() => {
    if (!contextRef.current) return;
    if (anchorPoint.x + contextRef.current?.offsetWidth > window.innerWidth) {
      setAnchorPoint((prev) => ({
        ...prev,
        x: anchorPoint.x - (contextRef.current?.offsetWidth || 0),
      }));
    }
    if (anchorPoint.y + contextRef.current?.offsetHeight > window.innerHeight) {
      setAnchorPoint((prev) => ({
        ...prev,
        y: anchorPoint.y - (contextRef.current?.offsetHeight || 0),
      }));
    }
  }, [anchorPoint, contextRef]);

  return (
    <>
      <div ref={itemRef} {...rest}>
        {children}
      </div>
      {showMenu && (
        <div
          ref={contextRef}
          className="fixed z-[99999] w-max overflow-hidden rounded-lg bg-white p-1 shadow-lg dark:bg-[#18191c] dark:shadow-none"
          style={{ left: `${anchorPoint.x}px`, top: `${anchorPoint.y}px` }}
        >
          {items}
        </div>
      )}
    </>
  );
};
