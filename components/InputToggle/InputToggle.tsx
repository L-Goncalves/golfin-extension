import { Switch } from "~components/ui/switch";
import { cn } from "~lib/utils";

interface IProps {
  label: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
}

export const InputToggle = (props: IProps) => {
  const { label, value, onChange } = props;

  return (
    <div className="flex items-center justify-between rounded-[10px] bg-gray-200/[0.08] p-2.5">
      <label 
        htmlFor="extension-toggle" 
        className="text-base font-semibold cursor-pointer"
      >
        {label}:
      </label>
      <Switch
        id="extension-toggle"
        checked={value}
        onCheckedChange={onChange}
        className={cn(
          // Custom sizing to match original design (60x30px)
          "h-[30px] w-[60px] border-0",
          // Unchecked state (original #ccc background)
          "data-[state=unchecked]:bg-gray-300",
          // Checked state (LinkedIn blue #0a66c2)
          "data-[state=checked]:bg-linkedin-primary",
          // Smooth transition (0.4s like original)
          "transition-all duration-400"
        )}
        thumbClassName={cn(
          // Custom thumb sizing to match original (26x26px with 2px margin)
          "h-[26px] w-[26px]",
          // White background like original
          "bg-white",
          // Smooth transition for movement (0.4s like original)
          "transition-transform duration-400",
          // Position adjustments for proper alignment
          "data-[state=unchecked]:translate-x-[2px]",
          "data-[state=checked]:translate-x-[32px]"
        )}
      />
    </div>
  );
};
