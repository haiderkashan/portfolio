"use server";

import { z } from "zod";
import { serverClient } from "@/sanity/lib/serverClient";
import { contactFormSchema } from "@/lib/schemas";

export async function submitContactForm(formData: FormData) {
  // 2. Extract raw data
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    address: formData.get("address"),
  };

  // 3. Validate data using Zod
  // ... (logs removed for production, but kept if you want to verify)
  const result = contactFormSchema.safeParse(rawData);

  // 4. Check for Validation Errors
  if (!result.success) {
    const firstError = result.error.issues[0].message;
    return { success: false, error: firstError };
  }

  // 5. Check Honeypot (Bot Detection)
  // The data for 'address' is now clean (string, null, or undefined)
  if (result.data.address && result.data.address.length > 0) {
    // Honeypot was filled by a bot. We can return success to be stealthy.
    return { success: true };
  }

  // 6. Save to Sanity
  try {
    await serverClient.create({
      _type: "contact",
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message,
      submittedAt: new Date().toISOString(),
      status: "new",
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: "Failed to submit the form. Please try again later." };
  }
}