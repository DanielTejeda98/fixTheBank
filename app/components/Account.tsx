"use client";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import NotificationCard from "./NotificationCard";
import { approveJoinRequest, getRequestersList } from "../lib/budgetApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setJoinRequestList } from "@/redux/features/budget-slice";
import { signOut, useSession } from "next-auth/react";

export default function Account({ closeDrawer }: { closeDrawer: Function }) {
  const router = useRouter();
  const reduxDispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const getRequesters = useAppSelector(
    (state) => state.budgetReducer.value.joinRequests
  );
  const getBudgetId = useAppSelector((state) => state.budgetReducer.value._id);
  const getUserId = useSession().data?.user?.id;
  const logout = () => {
    signOut();
    closeDrawer();
    router.refresh();
  };

  const approveRequestee = async (requesterId: string) => {
    try {
      setPending(true);
      const res = await approveJoinRequest(
        { userId: getUserId },
        getBudgetId,
        requesterId
      );
      if (!res.success) {
        // TODO: display error
        console.log(res.error);
        setPending(false);
        return;
      }

      // Update requesters list
      await getRequestersListResponse();
    } catch (error) {
      // TODO: display error
      console.error(error);
    }
    setPending(false);
  };

  const getRequestersListResponse = async () => {
    try {
      const res = await getRequestersList({ userId: getUserId }, getBudgetId);
      if (!res.success) {
        // TODO: display error
        console.log(res.error);
        return;
      }

      reduxDispatch(
        setJoinRequestList({
          joinRequests: res.data,
        })
      );
    } catch (error) {
      // TODO: display error
      console.error(error);
    }
  };

  const renderJoinRequests = () => {
    return getRequesters?.slice(0, 3).map((requester) => {
      return (
        <NotificationCard key={requester._id}>
          <div className="flex flex-wrap border-solid border-gray-500 border-b-2 pb-2">
            <p>{requester.username} would like to join your budget!</p>
            <div className="flex gap-3 mt-1">
              <button
                className="text-sm bg-slate-500 rounded-md p-1"
                onClick={() => approveRequestee(requester._id)}
                disabled={pending}
              >
                Approve
              </button>
              <button
                className="text-sm bg-red-700 rounded-md p-1"
                disabled={pending}
              >
                Deny
              </button>
            </div>
          </div>
        </NotificationCard>
      );
    });
  };

  return (
    <div>
      <div className="flex flex-wrap">
        <button
          className="p-2 bg-red-500 text-sm rounded-md ml-auto"
          onClick={logout}
        >
          Log out
        </button>
      </div>

      <div className="grid gap-3 mt-3 overflow-auto border p-1 rounded-md">
        <h2>Requests</h2>
        {renderJoinRequests()}
      </div>
    </div>
  );
}
