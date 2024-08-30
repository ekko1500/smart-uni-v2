"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  updateSeenStatus,
  getReportById,
  updateReportStatus,
} from "@/functions/functions";
import { usePathname } from "next/navigation";
import { Clock, Eye, Mail, MapPin, Paperclip, Wrench } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UpdateForm = ({ reportId }) => {
  const [initialValues, setInitialValues] = useState(null);
  const [status, setStatus] = useState("");
  const [seen, setSeen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const fetchReport = async () => {
      const reportIdFromPath = pathname.split("/").pop();

      try {
        const report = await getReportById(reportIdFromPath);
        if (!report?.seen) {
          await updateSeenStatus(reportIdFromPath);
        }

        if (report) {
          setInitialValues(report);
          setStatus(report.status);
          setSeen(report.seen);
          setSelectedEmail(report.email); // set default email
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    fetchReport();
  }, [pathname]);

  const onSubmit = async () => {
    const reportIdFromPath = pathname.split("/").pop();
    try {
      updateReportStatus(reportIdFromPath, status);

      // Handle success or navigate to another page
    } catch (error) {
      console.error("Error updating report:", error);
      // Handle error
    }
  };

  const handleStatusChange = (selectedStatus) => {
    setStatus(selectedStatus);
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-1/2 mx-auto bg-white rounded-lg overflow-hidden p-1">
      {/* Email */}
      <div className="flex gap-4 mb-4 p-4 border-b border-gray-200 items-stretch justify-around">
        <div className="flex">
          <img
            className="h-16 w-16"
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${initialValues.email}`}
            alt="user-image"
          />
          <div className="flex flex-col gap-1">
            <div className="text-gray-800 font-bold text-lg">
              {initialValues.email}
            </div>
            <div className="text-gray-400 text-xs flex gap-2 items-center">
              <Clock />
              {new Date(initialValues.time).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-end gap-2">
          <div className="flex gap-2 text-slate-500">
            <Wrench /> <p>Status:</p>
          </div>

          <div className=" flex gap-2 items-center w-1/3">
            <Select
              onValueChange={handleStatusChange}
              defaultValue={initialValues.status}
            >
              <SelectTrigger>
                <SelectValue placeholder={initialValues.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">pending</SelectItem>
                <SelectItem value="processing">processing</SelectItem>
                <SelectItem value="completed">completed</SelectItem>
              </SelectContent>
            </Select>
            {status == "pending" ? (
              <>
                <img src="../../assets/warning.png" className=" h-8 w-auto" />
              </>
            ) : status == "processing" ? (
              <>
                {" "}
                <img src="../../assets/process.gif" className=" h-10 w-auto" />
              </>
            ) : (
              <>
                {" "}
                <img src="../../assets/check.png" className=" h-8 w-auto" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 p-4 border-b border-gray-200">
        <div className="text-sm mb-2 text-slate-500 flex gap-2 items-center justify-between">
          <div className="flex gap-2">
            <Paperclip /> Description{" "}
          </div>
          <div className="flex text-slate-500 text-xs items-center gap-2">
            <Eye /> Seen
          </div>
        </div>

        <div className="text-gray-800">{initialValues.description}</div>
      </div>

      {/* Image */}
      {initialValues.imageUrl && (
        <div className="mb-4 p-4 border-b border-gray-200">
          <img
            src={initialValues.imageUrl}
            alt="Report Image"
            className="rounded-md"
          />
        </div>
      )}

      {/* Location */}
      <div className="mb-4 p-4 border-b border-gray-200">
        <div className="text-gray-800 flex gap-2">
          <MapPin />
          Location: {initialValues.location}
        </div>
      </div>

      {/* Update Button */}
      <div className="flex justify-end p-4 items-center">
        <Button onClick={onSubmit} className="">
          Update Report
        </Button>
      </div>
    </div>
  );
};

export default UpdateForm;
