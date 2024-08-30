import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SwitchDemo({ status, label, label2 }: any) {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="airplane-mode">{label}</Label>
      <Switch id="airplane-mode" checked={status == "1" ? true : false} />
      <Label htmlFor="airplane-mode">
        {label2 == 1
          ? " Status : Auto"
          : label2 == 0
          ? " Status : Manual"
          : "" || ""}
      </Label>
    </div>
  );
}
