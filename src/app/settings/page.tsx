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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import useMethod from "@/hooks/useCommandMethod";

type Props = {};

interface Setting {
  category: string;
  value: string | number | boolean;
  description: string;
}

const handleEdit = (setting: Setting) => {
  // Implement the logic to edit the setting
  alert(`Editing setting: ${setting.category}`);
};

const FormSchema = z.object({
  method: z.string({
    required_error: "Please select a method to command the bot.",
  }),
});

export default function SettingsPage({}: Props) {
  const [method, updateMethod] = useMethod();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleMethodChange = (value) => {
    updateMethod(value);
  };

  return (
    <div>
      <div className="px-4 space-y-6 md:px-6">
        <header className="space-y-1.5">
          <div className="flex items-center space-x-4">
            <img
              className="h-[96px] w-[96px]"
              src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${Math.random()}`}
              alt="user-image"
            />
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold">Catherine Grant</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Product Designer
              </p>
            </div>
          </div>
        </header>
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  defaultValue="Catherine Grant"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Enter your email" type="email" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter your phone" type="tel" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Change Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  placeholder="Enter your current password"
                  type="password"
                />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  placeholder="Enter your new password"
                  type="password"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  placeholder="Confirm your new password"
                  type="password"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-2">
          <Button size="lg">Save</Button>
          <Button variant="outline" size="lg">
            Log Out
          </Button>
        </div>

        <Form {...form}>
          <form className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Command Method</FormLabel>
                  <Select
                    onValueChange={handleMethodChange}
                    defaultValue={method}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={method} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="voice-command">
                        Voice-Command
                      </SelectItem>{" "}
                      <SelectItem value="text-command">Text-Command</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose a command method to command
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
