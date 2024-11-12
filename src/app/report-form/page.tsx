"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Webcam from "react-webcam";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addReport } from "@/functions/functions";
import { storage } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// Schema validation
const formSchema = z.object({
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters." }),
  time: z.string().min(1, { message: "Time must be provided." }),
  status: z.enum(["pending", "processing", "completed"], {
    errorMap: () => ({ message: "Select a valid status." }),
  }),
  seen: z.boolean(),
  imageUrl: z.string(),
});

const FormPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isWebcam, setIsWebcam] = useState(false);
  const webcamRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      description: "",
      email: "",
      location: "",
      time: "",
      status: "pending",
      seen: false,
      imageUrl: "",
    },
  });

  const uploadImageAndStoreData = async (
    imageFile: File
  ): Promise<string | void> => {
    try {
      // Create a storage reference
      const storageRef = ref(storage, `images/${imageFile.name}`);

      // Upload the file
      const snapshot = uploadBytesResumable(storageRef, imageFile);

      return new Promise((resolve, reject) => {
        snapshot.on(
          "state_changed",
          (uploadSnapshot) => {
            const percent = Math.round(
              (uploadSnapshot.bytesTransferred / uploadSnapshot.totalBytes) *
                100
            );

            // update progress
            console.log(percent);
          },
          (err) => {
            console.error(err);
            reject(err);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(snapshot.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              console.error("Error getting download URL:", error);
              reject(error);
            }
          }
        );
      });
    } catch (e) {
      console.error("Error uploading image and storing data: ", e);
    }
  };

  const timeValue = form.watch("time");

  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = new Date(now.getTime() - offset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
        form.setValue("time", getCurrentDateTime());
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const captureWebcamImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageSrc(imageSrc);

      // Convert data URL to file object
      const byteString = atob(imageSrc.split(",")[1]);
      const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "webcam.jpg", { type: mimeString });
      setImageFile(file); // Save the file for later upload
    }
  };

  const onSubmit = async (values) => {
    console.log("Form data:", values);
    // console.log(imageFile);
    try {
      let url = await uploadImageAndStoreData(imageFile);
      console.log(url);
      const reportData = { ...values, imageUrl: url };
      console.log(reportData);
      await addReport(reportData);
      router.push("../reports");
      toast({
        title: "Success",
        description: "Report sent successfully!",
      });
    } catch (e) {
      console.error("Error submitting form: ", e);
      toast({
        title: "Error",
        description: "Failed to send report. Please try again.",
      });
    }
  };

  return (
    <div className="w-1/2 mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {timeValue ? (
            <div>
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <div>
              <p className="  text-slate-600">No time set yet.</p>
            </div>
          )}

          {!imageSrc && (
            <div>
              <Button
                className=" mb-4"
                type="button"
                onClick={() => setIsWebcam(!isWebcam)}
              >
                {isWebcam ? "Use Local Device" : "Use Webcam"}
              </Button>
              {isWebcam ? (
                <>
                  <Webcam
                    audio={false}
                    screenshotFormat="image/jpeg"
                    ref={webcamRef}
                  />
                  <Button
                    className=" mt-4"
                    type="button"
                    onClick={captureWebcamImage}
                  >
                    Capture
                  </Button>
                </>
              ) : (
                <Input type="file" accept="image/*" onChange={handleCapture} />
              )}
            </div>
          )}

          {imageSrc && (
            <div>
              <img src={imageSrc} alt="Captured" />
            </div>
          )}

          <div className=" flex flex-row gap-4 w-full">
            <Button type="submit">Submit</Button>

            {imageSrc && (
              <>
                <Button onClick={() => setImageSrc(null)}>Try Again</Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormPage;
