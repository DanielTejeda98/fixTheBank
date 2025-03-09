"use client"

import { useAppSelector } from "@/redux/store";
import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export default function AccessList({ owner, members }: { owner: User, members: User[] }) {
    const isBudgetOwner = useAppSelector((state) => state.budgetReducer.value.isOwner);

    return (
        <div className="flex flex-col gap-2">
            {!isBudgetOwner ? (
                <p>
                    You do not have access to manage this setting.
                </p>
            ) : (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Owner</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <p>Name: {owner.username}</p>
                                <p>Email: {owner.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {members.map(member => (
                        <Card key={member._id}>
                            <CardHeader>
                                <CardTitle>Owner</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <p>Name: {member.username}</p>
                                    <p>Email: {member.email}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                    }
                </>
            )}
        </div>
    )
}