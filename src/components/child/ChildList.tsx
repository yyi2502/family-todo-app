"use client";

import { useUserStore } from "@/stores/userStore";
import { UserType } from "@/types";
import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ChildList() {
  // const childList = useUserStore((state) => state.childList);
  const childList = useUserStore((state) => state.childList || []);
  const selectedUser = useUserStore((state) => state.selectedUser);
  console.log(childList);
  return (
    <>
      <ul>
        {childList.length > 0 ? (
          childList.map((child: UserType) => (
            <li key={child.id}>
              <Link href={`/main/child/${child.id}`}>
                <div key={child.id} className="indicator">
                  {selectedUser?.id === child.id && (
                    <span className="indicator-item badge badge-success">
                      <Star width={20} height={20} />
                    </span>
                  )}
                  {child.name}
                  {child.id === selectedUser?.id && (
                    <span>
                      <Star />
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p>こどもユーザーは未登録です</p>
        )}
      </ul>
    </>
  );
}
