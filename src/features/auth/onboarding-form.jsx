import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth, db } from "../../firebaseConfig";


const randomAvatar = () => {
  const seed = Math.floor(Math.random() * 1000);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

export function OnboardingForm() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    avatar: randomAvatar(),
    role: "buyer",
    bio: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not logged in");
      }

      await setDoc(doc(db, "users", user.uid), {
        ...form,
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });

      alert("Onboarding successful!");
    } catch (err) {
      console.error(err);
      alert("Error saving user data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Onboarding</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={form.avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full border"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  avatar: randomAvatar(),
                }))
              }
            >
              Generate New Avatar
            </Button>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Enter your location"
              value={form.location}
              onChange={(e) =>
                handleChange("location", e.target.value)
              }
              required
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1">
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself..."
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
