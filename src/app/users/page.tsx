"use client";

import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUsers } from "@/functions/functions";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "@/components/LoadingSkeleton";

type Props = {};
type Payment = {
  name: string;
  email: string;
  lastOrder: string;
  method: string;
};

const data: Payment[] = [
  {
    name: "John Doe",
    email: "john@example.com",
    lastOrder: "2023-01-01",
    method: "Credit Card",
  },
  {
    name: "Alice Smith",
    email: "alice@example.com",
    lastOrder: "2023-02-15",
    method: "PayPal",
  },
];

export default function UsersPage({}: Props) {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center">
            <img
              className="h-10 w-10"
              src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${row.getValue(
                "username"
              )}`}
              alt="user-image"
            />
            <p>{row.getValue("username")} </p>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "",
      header: "Edit",
      cell: ({ row }) => {
        return (
          <div className="flex gap-6 items-center ">
            <img
              onClick={() => {
                console.log(row.getValue("email"));
                //route to row.getValue("email")
                router.push(`./users/${row.getValue("email")}`);
              }}
              className="h-6 w-6"
              src="assets/quill-pen.png"
              alt="pen"
            />
            <img
              onClick={() => {
                console.log(row.getValue("email"));
              }}
              className="h-6 w-6"
              src="assets/trash-can.png"
              alt="can"
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    async function fetchUsers() {
      const _users = await getUsers();
      setUsers(_users);
      setLoading(false); // Set loading to false after data is fetched
    }

    console.log("fetch data");

    fetchUsers();
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  if (loading) {
    return <LoadingSkeleton />; // Show loading state
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
        </TabsList>
        <div className="flex w-full items-end justify-end">
          <Link
            className="bg-slate-950 hover:bg-slate-700 text-white py-2 px-4 rounded flex items-center justify-start w-fit my-4"
            href="/users/create"
          >
            <span style={{ textTransform: "uppercase", textAlign: "left" }}>
              Create user
            </span>
          </Link>
        </div>

        <TabsContent value="all">
          {loading ? (
            <div>Loading...</div> // Display loading indicator
          ) : (
            <DataTable columns={columns} data={users} />
          )}
        </TabsContent>

        <TabsContent value="students">
          <DataTable columns={columns} data={data} />
        </TabsContent>
        <TabsContent value="teachers">
          <DataTable columns={columns} data={data} />
        </TabsContent>
        <TabsContent value="employees">
          <DataTable columns={columns} data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
