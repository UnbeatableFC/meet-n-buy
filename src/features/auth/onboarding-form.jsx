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
import { randomAvatar } from "../../hooks/random-avatar";
import { useNavigate } from "react-router";
import { useUserAuth } from "../../context/userAuthContext";

export function OnboardingForm() {
  const [form, setForm] = useState({
    uid: "", // from auth.currentUser.uid
    email: "", // from auth.currentUser.email
    displayName: "", // from auth.currentUser.displayName OR your signup form
    photoURL: randomAvatar(), // from auth.currentUser.photoURL OR fallback
    location: "",
    role: "buyer", // default role
    bio: "",
    phoneNumber: "",
    createdAt: Date.now(), // when profile created
    updatedAt: Date.now(), // keep for updates
    friends: [],
    friendRequests: [],
    sentFriendRequest: [],
  });

  const [loading, setLoading] = useState(false);
  const { setOnboarded } = useUserAuth();
  const navigate = useNavigate();

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
      setOnboarded(true);
      alert("Onboarding successful!");
      navigate("/dashboard");
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
              src={form.photoURL}
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
            <Label htmlFor="displayName">Full Name</Label>
            <Input
              id="displayName"
              name="displayName"
              placeholder="Enter your name"
              value={form.displayName}
              onChange={(e) =>
                handleChange("displayName", e.target.value)
              }
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
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={form.phoneNumber}
              onChange={(e) =>
                handleChange("phoneNumber", e.target.value)
              }
              required
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
