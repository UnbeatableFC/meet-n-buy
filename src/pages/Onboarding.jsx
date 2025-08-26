import { useState } from "react";
import {
  doc,
  // getDoc,
  // serverTimestamp,
  // setDoc,
  updateDoc,
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
import { Navigate, useNavigate } from "react-router";
import { useUserAuth } from "../context/userAuthContext";
import { Checkbox } from "../components/ui/checkbox";
// import toast from "react-hot-toast";

const items = [
  { id: "1", title: "Clothes" },
  { id: "2", title: "Phones" },
  { id: "3", title: "Chairs" },
  { id: "4", title: "Bags" },
  { id: "5", title: "Shoes" },
  { id: "6", title: "Laptop" },
  { id: "7", title: "Cars" },
  { id: "8", title: "Home Appliances" },
  { id: "9", title: "Books" },
  { id: "10", title: "Make-up" },
];

export default function Onboarding() {
  const { user, onboarded, loading, setOnboarded } = useUserAuth();
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    displayName: "", // from auth.currentUser.displayName OR your signup form
    photoURL: randomAvatar(), // from auth.currentUser.photoURL OR fallback
    location: "",
    role: "", // default role
    itemsSelected: [],
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
      itemsSelected: [],
      [field]: value,
    }));
  };

  const handleSubmit = async (e, navigate) => {
    e.preventDefault();

    try {
      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        uid: user.uid, // from Firebase Auth user object
        displayName: user.displayName || "", // from Firebase Auth user object
        email: user.email, // same
        photoURL: user.photoURL || "", // same
        ...form, // your additional user input fields from form
        onboarded: true, // explicitly mark onboarding done
      });

      setOnboarded(true);
      navigate("/dashboard"); // Imperative navigation on success
    } catch (err) {
      console.error("Onboarding error:", err);
    }
  };

  const handleCheckboxChange = (id) => {
    setForm((prev) => {
      const isSelected = prev.itemsSelected.includes(id);
      return {
        ...prev,
        itemsSelected: isSelected
          ? prev.itemsSelected.filter((item) => item !== id)
          : [...prev.itemsSelected, id],
      };
    });
  };

  if (loading) {
    return (
      <div className="flex text-5xl items-center justify-center h-screen">
        is this one Loading...
      </div>
    );
  } else if (!onboarded) {
    // 🔹 Render actual onboarding form UI here
    // const handleFinishOnboarding = async () => {
    //   if (!user) return;
    //   try {
    //     await setDoc(
    //       doc(db, "users", user.uid),
    //       { onboarded: true },
    //       { merge: true }
    //     );
    //     toast.success("Onboarding complete 🎉");
    //     navigate("/dashboard");
    //   } catch (err) {
    //     console.error("Error finishing onboarding:", err);
    //   }
    // };

    return (
      <Card className="max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              handleSubmit(e, navigate);
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
                    photoURL: randomAvatar(),
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

            {/* Items */}
            {form.role === "seller" && (
              <div className="flex flex-col gap-1">
                <Label>Items</Label>
                <div className="grid grid-cols-4 space-y-2">
                  {items.map((item) => (
                    <label
                      key={item.id}
                      className="inline-flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={form.itemsSelected.includes(
                          item.title
                        )}
                        onCheckedChange={() =>
                          handleCheckboxChange(item.title)
                        }
                      />
                      <span>{item.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

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
}
