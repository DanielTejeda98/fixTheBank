"use client";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import NotificationCard from "./NotificationCard";
import { approveJoinRequest, getRequestersList } from "../../lib/budgetApi";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setJoinRequestList } from "@/redux/features/budget-slice";
import { useSession } from "next-auth/react";
import { getUser, signUserOut } from "../../lib/userApi";
import { Button } from ".././ui/button";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";

export default function Account() {
  const { setOpen: setOpenDrawer } = useFTBDrawer(); 
  const router = useRouter();
  const reduxDispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const getRequesters = useAppSelector(
    (state) => state.budgetReducer.value.joinRequests
  );
  const userInformation = useAppSelector((state) => state.userReducer.value);
  const getBudgetId = useAppSelector((state) => state.budgetReducer.value._id);
  const getUserId = useSession().data?.user?.id;
  const logout = () => {
    signUserOut();
    setOpenDrawer(false);
    router.refresh();
  };

  useEffect(() => {
    async function fetchData () {
      await getUser();
    }
    fetchData();
  }, [])

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
    return getRequesters?.slice(0, 3).map((requester: any) => {
      return (
        <NotificationCard key={requester._id}>
          <div className="flex flex-wrap border-solid border-gray-500 border-b-2 pb-2">
            <p>{requester.username} would like to join your budget!</p>
            <div className="flex gap-3 mt-1">
              <Button
                className="text-sm rounded-md p-1"
                onClick={() => approveRequestee(requester._id)}
                disabled={pending}
              >
                Approve
              </Button>
              <Button variant="destructive"
                className="text-sm rounded-md p-1"
                disabled={pending}
              >
                Deny
              </Button>
            </div>
          </div>
        </NotificationCard>
      );
    });
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Account Infromation</DrawerTitle>
      </DrawerHeader>
      <DrawerBody className="flex flex-col w-full">
      <div className="flex flex-col w-full items-center gap-3">
          <div className="font-bold text-xl">{userInformation.username}</div>
          <div className="font-thin">{userInformation.email}</div>
        </div>

        <div className="grid gap-3 mt-3 overflow-auto border p-1 rounded-md">
          <h2>Requests</h2>
          {renderJoinRequests()}
        </div>
      </DrawerBody>

      <DrawerFooter className="flex flex-wrap grow w-full items-end">
        <Button variant="destructive"
              className="p-2 text-sm rounded-md ml-auto w-full"
              onClick={logout}>Log out</Button>
      </DrawerFooter>
    </>
  );
}
