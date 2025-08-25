import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
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
import { db } from "../firebaseConfig";
import { randomAvatar } from "../hooks/random-avatar";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/userAuthContext";
import toast from "react-hot-toast";

export default function Onboarding() {
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const createProfileIfNotExists = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // 🔹 create profile with basic fields
          await setDoc(userRef, {
            ...form,
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            createdAt: serverTimestamp(),
            onboarded: false, // 🔹 flag for onboarding completion
          });

          toast.success("Profile created successfully");
        }
      } catch (err) {
        console.error("Error creating user profile:", err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    createProfileIfNotExists();
  }, [user, form]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // 🔹 Render actual onboarding form UI here
  const handleFinishOnboarding = async () => {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { onboarded: true },
        { merge: true }
      );
      toast.success("Onboarding complete 🎉");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error finishing onboarding:", err);
    }
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Onboarding</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFinishOnboarding();
          }}
          className="flex flex-col gap-4"
        >
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
