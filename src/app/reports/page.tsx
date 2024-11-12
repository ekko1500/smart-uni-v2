"use client";

import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import { cn } from "@/lib/utils";
import { getReports } from "@/functions/functions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSkeleton from "@/components/LoadingSkeleton";

type Props = {};
type Payment = {
  order: string;
  status: string;
  lastOrder: string;
  method: string;
};

export default function OrdersPage({}: Props) {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const dateSort = (rowA, rowB, columnId) => {
    const dateA = new Date(rowA.getValue(columnId));
    const dateB = new Date(rowB.getValue(columnId));
    return dateA - dateB; // ascending order
  };

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <div className=" flex flex-col">
            <div>{row.getValue("email")}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className=" flex flex-col">
            <img
              className=" h-24 w-24  object-contain"
              src={row.getValue("imageUrl")}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <div
            className={cn("font-medium w-fit px-4 py-2 rounded-lg", {
              "bg-red-200": row.getValue("status") === "pending",
              "bg-orange-200": row.getValue("status") === "processing",
              "bg-green-200": row.getValue("status") === "completed",
            })}
          >
            {row.getValue("status")}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "time",
      header: "Time",
      sortingFn: dateSort,
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      accessorKey: "seen",
      header: "New",
      cell: ({ row }) => {
        return (
          <div className="flex items-center  w-full gap-4">
            {!row.getValue("seen") && (
              <div className="p-2 bg-red-600 text-white rounded ">new</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: "View",
      cell: ({ row }) => {
        return (
          <div className="flex items-center  w-full gap-4">
            <div
              onClick={() => {
                router.push(`./reports/${row.getValue("id")}`);

                console.log(row.getValue("id"));
              }}
              className="h-6 w-6"
            >
              <img src="../assets/eye.png " className=" w-7 h-7" />
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    async function fetchReports() {
      const _reports = await getReports();
      setReports(_reports);
      setLoading(false); // Set loading to false after data is fetched
    }

    fetchReports();
  }, []);

  useEffect(() => {
    console.log(reports);
  }, [reports]);

  if (loading) {
    return <LoadingSkeleton />; // Show loading state
  }
  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Reports" />
      <div className=" flex w-full items-end justify-end ">
        <Link
          className="bg-slate-950 hover:bg-slate-700 text-white py-2 px-4 rounded flex items-center justify-start w-fit my-4"
          href="/reports/create"
        >
          <span style={{ textTransform: "uppercase", textAlign: "left" }}>
            Create Report
          </span>
        </Link>
      </div>
      {loading ? (
        <div>Loading...</div> // Display loading indicator
      ) : (
        <DataTable columns={columns} data={reports} />
      )}
    </div>
  );
}
