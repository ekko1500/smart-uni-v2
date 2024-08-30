"use client";

import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteRFIDById } from "@/functions/functions";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import NameCard from "@/components/NameCard";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Props = {};
type Payment = {
  userId: string;
  status: string;
  rfidId: string;
  method: string;
};

export default function CardsPage({}: Props) {
  const router = useRouter();
  const [RFIDs, setRFIDs] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "userId",
      header: "User ID",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center">
            <NameCard userId={row.getValue("userId")} />
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "rfidId",
      header: "RFID ID",
    },
    {
      accessorKey: "method",
      header: "Method",
    },
    {
      accessorKey: "",
      header: "Edit",
      cell: ({ row }) => {
        return (
          <div className="flex gap-6 items-center">
            <img
              onClick={() => {
                deleteRFIDById(row.getValue("rfidId"));
              }}
              className="h-6 w-6 cursor-pointer"
              src="/assets/trash-can.png"
              alt="Delete"
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rfid_cards"), (snapshot) => {
      const fetchedRFIDs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRFIDs(fetchedRFIDs);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex w-full items-end justify-end">
          <Link
            className="bg-slate-950 hover:bg-slate-700 text-white py-2 px-4 rounded flex items-center justify-start w-fit my-4"
            href="/rfids/register"
          >
            <span style={{ textTransform: "uppercase", textAlign: "left" }}>
              Register RFID
            </span>
          </Link>
        </div>

        <TabsContent value="all">
          <DataTable columns={columns} data={RFIDs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
