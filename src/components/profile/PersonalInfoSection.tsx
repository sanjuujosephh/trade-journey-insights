
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoSectionProps {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  phoneNumber: string | null;
  onChange: (field: string, value: string) => void;
}

export function PersonalInfoSection({
  firstName,
  lastName,
  username,
  phoneNumber,
  onChange,
}: PersonalInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName || ""}
            onChange={(e) => onChange("first_name", e.target.value)}
            placeholder="Enter your first name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName || ""}
            onChange={(e) => onChange("last_name", e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username || ""}
          onChange={(e) => onChange("username", e.target.value)}
          placeholder="Enter your username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          value={phoneNumber || ""}
          onChange={(e) => onChange("phone_number", e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  );
}
