/** @format */
"use client";

import React, { useState, useEffect } from "react";
import { Nav } from "./ui/nav";
import {
  LayoutDashboard,
  UsersRound,
  Settings,
  ChevronRight,
  Mail,
  Bot,
  Wifi,
  Info,
  FilePlus2,
} from "lucide-react";
import { Button } from "./ui/button";
import { useWindowWidth } from "@react-hook/window-size";
import { usePathname } from "next/navigation";

type Props = {};

const allowedRoutes = ["/login"];

const SideNavbar = (props: Props) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure this logic runs only on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  if (!isClient) {
    return null; // Render nothing on the server side to avoid hydration issues
  }

  function isRouteAllowed(routeName, allowedRoutes) {
    return !allowedRoutes.includes(routeName);
  }

  return (
    <>
      {isRouteAllowed(pathname, allowedRoutes) && (
        <>
          {" "}
          <div className="relative min-w-[160px] border-r px-3 pb-10 pt-24  opacity-0"></div>
          <div className="fixed min-w-[80px] border-r px-3 pb-10 pt-24 overflow-hidden h-full">
            {!mobileWidth && (
              <div className="absolute right-[-20px] top-7 z-50">
                {/* <Button
              onClick={toggleSidebar}
              variant="secondary"
              className="rounded-full p-2"
            >
              <ChevronRight />
            </Button> */}
              </div>
            )}
            <Nav
              isCollapsed={mobileWidth ? true : isCollapsed}
              links={[
                {
                  title: "Dashboard",
                  href: "/",
                  icon: LayoutDashboard,
                  variant: "default",
                },
                {
                  title: "Users",
                  href: "/users",
                  icon: UsersRound,
                  variant: "ghost",
                },
                {
                  title: "Reports",
                  href: "/reports",
                  icon: Mail,
                  variant: "ghost",
                },
                {
                  title: "Settings",
                  href: "/settings",
                  icon: Settings,
                  variant: "ghost",
                },
                {
                  title: "RFIDs",
                  href: "/rfids",
                  icon: FilePlus2,
                  variant: "ghost",
                },
                {
                  title: "About",
                  href: "/about",
                  icon: Info,
                  variant: "ghost",
                },
              ]}
            />
          </div>
        </>
      )}{" "}
    </>
  );
};

export default SideNavbar;
