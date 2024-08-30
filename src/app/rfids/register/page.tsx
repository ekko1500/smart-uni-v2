/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createRFID,
  fetchUsernamesNotInRFIDCards,
} from "@/functions/functions";
import { MQTT_API_CARGATE } from "@/lib/MQTTapi";
import useMqtt from "@/hooks/useMqtt";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

const FormSchema = z.object({
  rfidId: z.string().min(1, { message: "RFID ID is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  status: z.string(),
});

export default function RegisterPage() {
  const { message: rfid_id } = useMqtt(MQTT_API_CARGATE, "esp8266/rfid-id");
  const [isLoading, setIsLoading] = useState(false);
  const [unregisterUsernames, setUnregisterUsernames] = useState([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rfidId: "",
      username: "",
      status: "out",
    },
  });

  const checkRFIDExists = async (rfidId) => {
    try {
      const querySnapshot = await getDocs(collection(db, "rfid_cards"));
      const exists = querySnapshot.docs.some(
        (doc) => doc.data().rfidId === rfidId
      );

      if (exists) {
        return false; // Return false if the RFID exists
      } else {
        return true; // Return true if the RFID does not exist
      }
    } catch (error) {
      console.error("Error checking RFID-cards: ", error);
      throw new Error("Failed to check RFID-cards");
    }
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    await createRFID(data)
      .then(() => {
        setIsLoading(false);
        form.setValue("rfidId", "");
        form.setValue("username", "");
      })
      .catch((e) => {
        setIsLoading(false);
        console.error(e);
        alert("error");
      });
  };

  useEffect(() => {
    const unsubscribe = async () => {
      if (rfid_id) {
        const check = await checkRFIDExists(rfid_id);
        if (check) {
          form.setValue("rfidId", rfid_id);
        } else {
          toast.error("This didn't work. /n This card is already registered.");
        }
      }
    };

    unsubscribe();

    // Cleanup function if needed (optional)
    return () => {
      // Any cleanup logic, if necessary
    };
  }, [rfid_id, form]);

  useEffect(() => {
    const unsubscribe = async () => {
      const datas = await fetchUsernamesNotInRFIDCards();
      setUnregisterUsernames(datas);
    };

    unsubscribe();

    return () => {};
  }, []);

  return (
    <div>
      <div className="px-4 space-y-6 md:px-6">
        <header className="space-y-1.5">
          <h1 className="text-2xl font-bold">Register</h1>
        </header>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="rfidId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RFID ID</FormLabel>
                  <FormControl className="w-[280px]">
                    <Input {...field} placeholder="Enter your RFID ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select
                    onValueChange={(selectedUsername) => {
                      const selectedUser = unregisterUsernames.find(
                        (user) => user?.username === selectedUsername
                      );
                      if (selectedUser) {
                        field.onChange(selectedUser?.username); // Set the userName as the field value
                      }
                    }}
                  >
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Users</SelectLabel>
                        {unregisterUsernames?.map((user, index) => (
                          <SelectItem key={index} value={user?.username}>
                            {user?.username}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? "Loading..." : "Register"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
